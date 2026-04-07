using System.Globalization;
using System.Net;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using NokAir.Configuration.Extensions;
using NokAir.Logging.Configurations;
using NokAir.Logging.Extensions;
using NokAir.Logging.Services;
using NokAir.Shared.Middlewares.Security;
using NokAir.Shared.Security.Models.Common;
using NokAir.TalkToCeo.Shared.Repositories;
using NokAir.TalkToCeo.Shared.Services;
using Serilog;
using NokAir.TalkToCeo.Shared.Entities.Common;
using NokAir.TalkToCeo.Shared.Dtos;
using NokAir.Shared.Security.Services.InHouse;
using NokAir.Shared.Api.Responses.Factories;
using NokAir.Shared.Api.Responses.Factories.InHouse;
using NokAir.Shared.Resources.BookingLocalize;


// Read environment variables
var environment = Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") ?? "Production";
var encryptionKey = Environment.GetEnvironmentVariable("ENCRYPTION_KEY")
          ?? throw new InvalidOperationException("ENCRYPTION_KEY environment variable is not set");
var ivKey = Environment.GetEnvironmentVariable("IV_KEY")
    ?? throw new InvalidOperationException("IV_KEY environment variable is not set");

// Get the host name
var hostName = Dns.GetHostName();

// PHASE 1: Bootstrap with minimal configuration
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .Enrich.WithProperty("HostName", hostName)
    .WriteTo.Console(
        formatProvider: CultureInfo.InvariantCulture)
    .CreateBootstrapLogger();

Log.Information("Starting NokAir free voucher in {Environment} environment", environment);

// Load configuration from database
var initConfig = new ConfigurationBuilder()
    .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonEncryptionFile(
        prefixName: "appsettings",
        environment: environment,
        key: encryptionKey,
        iv: ivKey)
    .Build();

if (initConfig == null)
{
    Log.Fatal("Failed to load initial configuration. Ensure appsettings.{Environment}.json file exists.", environment);
    throw new InvalidOperationException("Initial configuration not found.");
}

var voucherDbConnection = initConfig["ConnectionStrings:TalkToCeo_DB_CONNECTION"] ?? string.Empty;
if (string.IsNullOrWhiteSpace(voucherDbConnection))
{
    Log.Fatal("TALKTOCEO_DB_CONNECTION is not configured in appsettings.{Environment}.json", environment);
    throw new InvalidOperationException("TALKTOCEO_DB_CONNECTION is not configured.");
}

var appLogDbConnection = initConfig["ConnectionStrings:TalkToCeo_LOG_DB_CONNECTION"] ?? string.Empty;
if (string.IsNullOrEmpty(appLogDbConnection))
{
    Log.Fatal("TALKTOCEO_LOG_DB_CONNECTION is not configured in appsettings.{Environment}.json", environment);
    throw new InvalidOperationException("TALKTOCEO_LOG_DB_CONNECTION is not configured.");
}

// Phase 2: Load configuration from database
var configBuilder = new ConfigurationBuilder()
    .AddConfiguration(initConfig)
    .AddPostgreSqlConfiguration("ConnectionStrings:TalkToCeo_DB_CONNECTION", initConfig);
var configuration = configBuilder.Build();

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.SetBasePath(AppDomain.CurrentDomain.BaseDirectory);
builder.Configuration.Sources.Clear();
builder.Configuration.AddConfiguration(configuration);

// Register AppLoggerConfiguration
builder.Services.Configure<AppLoggerConfiguration>(builder.Configuration.GetSection("AppLogger"));
builder.Services.Configure<List<ClientIDAndClientSecretValidation>>(builder.Configuration.GetSection("ClientApplications"));
builder.Services.Configure<JwtSettingsModel>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddScoped<IResponseFactory, ResponseFactory<BookingLocalize>>();

builder.Services.AddDbContext<TalkToCeoDbContext>(options => options.UseNpgsql(voucherDbConnection));

// Read AppLogger configuration for Serilog setup
var appLoggerConfig = builder.Configuration.GetSection("AppLogger").Get<AppLoggerConfiguration>();


if (appLoggerConfig == null)
{
    Log.Fatal("AppLogger configuration section is missing or invalid.");
    throw new InvalidOperationException("AppLogger configuration is required.");
}

// Set host name and environment in logger config
appLoggerConfig.HostName = hostName;
appLoggerConfig.Environment = environment;
Serilog.Debugging.SelfLog.Enable(msg => Console.Error.WriteLine("Serilog Error: " + msg));

// Override with environment-specific settings
Log.Logger = new LoggerConfiguration()
    .UseAppLogger(appLoggerConfig)
    .CreateLogger();
Serilog.Debugging.SelfLog.Enable(msg => Console.Error.WriteLine(msg));
builder.Host.UseSerilog();

// Register Serilog logger and AppLoggerConfiguration for DI
builder.Services.AddSingleton(Log.Logger);
builder.Services.AddSingleton(appLoggerConfig);

Log.Information("Voucher API is starting with Serilog configured for {Environment} environment", environment);

// Logging Service
builder.Services.AddScoped<IAppLogger, AppLoggerService>();

// Register IHttpContextAccessor
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Configure repositories
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IRoleRepository<Role>, RoleRepository>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<IUsersRepository<UserDto>, UsersRepository>();

// Configure services
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IUsersService<UserDto>, UsersService>();
builder.Services.AddScoped<IJwtTalkToCeo, JwtTalkToCeoService>();
builder.Services.AddScoped<IJwtService, JwtService>();

// Add services to the container.
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        // Configure Newtonsoft.Json settings here
        options.SerializerSettings.DateFormatString = "yyyy-MM-ddTHH:mm:ss";
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
        options.SerializerSettings.NullValueHandling = NullValueHandling.Include;
        options.SerializerSettings.Converters.Add(new StringEnumConverter());
        options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters
            .Add(new JsonStringEnumConverter());
    });

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Talk to CEO API",
        Version = "v1",
        Description = "Talk to CEO API",
    });
});

// Add Localization and set resource path
builder.Services.AddLocalization();
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[]
    {
                    new CultureInfo("en-US"),
    };

    options.DefaultRequestCulture = new RequestCulture(culture: "en-US", uiCulture: "en-US");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;

    options.AddInitialRequestCultureProvider(new CustomRequestCultureProvider(async context =>
    {
        return await Task.FromResult(new ProviderCultureResult("en"));
    }));
});

// Add JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettingsModel>();
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings?.Issuer ?? "www.nokair.com",
            ValidAudience = jwtSettings?.Audience ?? "www.nokair.com",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings?.SecretKey ?? string.Empty)),
            RoleClaimType = "roles",
            ClockSkew = TimeSpan.Zero,
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<IAppLogger>();
                logger.LogError(context.Exception, "Authentication failed.");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<IAppLogger>();
                logger.LogInformation("Token validated successfully.");
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<IAppLogger>();
                var ex = context.AuthenticateFailure;
                logger.LogWarning($"Token validation challenge: {ex?.Message}", ex);
                return Task.CompletedTask;
            },
        };
    });

// Register the permission handler.
builder.Services.AddAuthorization(options =>
{
    // Iterate through the list of permissions and add them to the policy.
    foreach (var role in NokAir.TalkToCeo.Shared.Constants.TalkToCeoRole.SystemRoles)
    {
        options.AddPolicy(role, policy => policy.Requirements.Add(new RoleRequirementModel(role)));
    }

    options.AddPolicy("AllRole", policy =>
    policy.Requirements.Add(new MultiRoleRequirementModel(new[]
        {
            NokAir.TalkToCeo.Shared.Constants.TalkToCeoRole.Admin,
            NokAir.TalkToCeo.Shared.Constants.TalkToCeoRole.User,
            NokAir.TalkToCeo.Shared.Constants.TalkToCeoRole.Ceo,
        })));

    options.AddPolicy("User", policy =>
        policy.Requirements.Add(new MultiRoleRequirementModel(new[]
        {
                    NokAir.TalkToCeo.Shared.Constants.TalkToCeoRole.Admin,
                    NokAir.TalkToCeo.Shared.Constants.TalkToCeoRole.User,
        })));
    options.AddPolicy("Ceo", policy =>
        policy.Requirements.Add(new MultiRoleRequirementModel(new[]
        {
                            NokAir.TalkToCeo.Shared.Constants.TalkToCeoRole.Admin,
                            NokAir.TalkToCeo.Shared.Constants.TalkToCeoRole.Ceo,
        })));
});

var app = builder.Build();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/TalkToCeo-api-spec.json", "Talk to CEO API V1");
        c.SwaggerEndpoint("/TalkToCeo-user-api-spec.json", "Talk to CEO User API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseStaticFiles();
app.UseMiddleware<JwtMiddleware>();
app.UseHttpsRedirection();
app.UseCors("AllowClient");
app.UseAuthorization();
app.MapControllers();
app.Run();

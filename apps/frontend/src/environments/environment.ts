// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  environment: 'UAT',
  // endpoint: 'http://10.94.23.31:9010/',
  endpoint: 'http://localhost:5220/',
  NokClientId: 'i8NwIWCi7v9h8BUjI17bDv38KP0969Pu',
  NokClientSecret: 'RF74aqMPJ2rHcqIrB0N9jsA22R8SARUt',
  portal_client: 'https://uat-portal.nokair.com/',
  // environment: 'Prod',
  // endpoint: '',
  // portal_client: 'https://portal.nokair.com/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
//import 'zone.js/plugins/zone-error'; // Included with Angular CLI.

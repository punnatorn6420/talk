import { Injectable, effect, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';

export type ColorScheme = 'light' | 'dark' | 'dim';

export type SupportedLanguage = 'th' | 'en';

export interface layoutConfig {
  inputStyle: string;
  preset?: string;
  primary?: string;
  surface?: string | undefined | null;
  ripple: boolean;
  darkTheme?: boolean;
  menuMode?: string;
  menuTheme?: string;
  colorScheme?: ColorScheme;
  lang?: SupportedLanguage;
}

interface LayoutState {
  staticMenuDesktopInactive?: boolean;
  overlayMenuActive?: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive?: boolean;
  menuHoverActive?: boolean;
  profileSidebarVisible: boolean;
  sidebarActive: boolean;
  anchored: boolean;
  overlaySubmenuActive: boolean;
  manualReadSidebarVisible: boolean;
  activeMenuItem: string | null;
}

interface MenuChangeEvent {
  key: string;
  routeEvent?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  _config: layoutConfig = {
    ripple: false,
    preset: 'Aura',
    primary: 'yellow',
    inputStyle: 'outlined',
    surface: 'slate',
    darkTheme: false,
    menuMode: 'horizontal',
    menuTheme: 'colorScheme',
    lang: 'th',
  };

  _state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    sidebarActive: false,
    anchored: false,
    overlaySubmenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    manualReadSidebarVisible: false,
    menuHoverActive: false,
    activeMenuItem: null,
  };

  layoutConfig = signal<layoutConfig>(this._config);

  layoutState = signal<LayoutState>(this._state);

  private configUpdate = new Subject<layoutConfig>();

  private overlayOpen = new Subject();

  private menuSource = new Subject<MenuChangeEvent>();

  private resetSource = new Subject();

  menuSource$ = this.menuSource.asObservable();

  resetSource$ = this.resetSource.asObservable();

  configUpdate$ = this.configUpdate.asObservable();

  overlayOpen$ = this.overlayOpen.asObservable();

  isDarkTheme = computed(() => this.layoutConfig().darkTheme);

  isSlim = computed(() => this.layoutConfig().menuMode === 'slim');

  isSlimPlus = computed(() => this.layoutConfig().menuMode === 'slim-plus');

  isHorizontal = computed(() => this.layoutConfig().menuMode === 'horizontal');

  isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

  transitionComplete = signal<boolean>(false);

  isSidebarStateChanged = computed(() => {
    const layoutConfig = this.layoutConfig();
    return (
      layoutConfig.menuMode === 'horizontal' ||
      layoutConfig.menuMode === 'slim' ||
      layoutConfig.menuMode === 'slim-plus'
    );
  });

  private initialized = false;

  constructor() {
    this.enforceDocumentLightMode();

    effect(() => {
      const config = this.layoutConfig();
      if (config) {
        this.onConfigUpdate();
        this.persistConfig();
      }
    });

    effect(() => {
      const config = this.layoutConfig();

      if (!this.initialized || !config) {
        this.initialized = true;
        return;
      }

      this.handleDarkModeTransition(config);
    });

    effect(() => {
      if (this.isSidebarStateChanged()) {
        this.reset();
      }
    });
  }

  private handleDarkModeTransition(config: layoutConfig): void {
    const supportsViewTransition = 'startViewTransition' in document;

    if (supportsViewTransition) {
      this.startViewTransition(config);
    } else {
      this.toggleDarkMode(config);
      this.onTransitionEnd();
    }
  }

  private startViewTransition(config: layoutConfig): void {
    const transition = document.startViewTransition(() => {
      this.toggleDarkMode(config);
    });

    transition.ready
      .then(() => {
        this.onTransitionEnd();
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  }

  toggleDarkMode(config?: layoutConfig): void {
    const _config = config || this.layoutConfig();
    if (_config.darkTheme) {
      this.layoutConfig.update((state) => ({
        ...state,
        darkTheme: false,
      }));
    }
    this.enforceDocumentLightMode();
  }

  private enforceDocumentLightMode(): void {
    document.documentElement.classList.remove('app-dark', 'dark');
    document.body.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }

  private onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }

  onMenuToggle() {
    if (this.isOverlay()) {
      this.layoutState.update((prev) => ({
        ...prev,
        overlayMenuActive: !this.layoutState().overlayMenuActive,
      }));

      if (this.layoutState().overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }

    if (this.isDesktop()) {
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuDesktopInactive:
          !this.layoutState().staticMenuDesktopInactive,
      }));
    } else {
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuMobileActive: !this.layoutState().staticMenuMobileActive,
      }));

      if (this.layoutState().staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }
  onConfigUpdate() {
    this._config = { ...this.layoutConfig() };
    this.configUpdate.next(this.layoutConfig());
  }

  onMenuStateChange(event: MenuChangeEvent) {
    this.menuSource.next(event);
  }

  reset() {
    this.resetSource.next(true);
  }

  onOverlaySubmenuOpen() {
    this.overlayOpen.next(null);
  }

  showProfileSidebar() {
    this.layoutState.update((state) => ({
      ...state,
      profileSidebarVisible: true,
    }));
  }

  showConfigSidebar() {
    this.layoutState.update((state) => ({
      ...state,
      configSidebarVisible: true,
    }));
  }

  showManualReadSidebar() {
    this.layoutState.update((state) => ({
      ...state,
      manualReadSidebarVisible: true,
    }));
  }

  hideConfigSidebar() {
    this.layoutState.update((prev) => ({
      ...prev,
      configSidebarVisible: false,
    }));
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  setLanguage(lang: SupportedLanguage): void {
    this.layoutConfig.update((state) => ({
      ...state,
      lang,
    }));
    this.persistConfig();
  }

  persistConfig(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const configValue = this.layoutConfig();
    window.localStorage.setItem(
      'user-theme-config',
      JSON.stringify(configValue),
    );
  }
}

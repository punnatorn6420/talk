import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { AppMenu } from './app.menu';
import { LayoutService } from '../service/layout.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenu, RouterModule],
  template: ` <div
    class="layout-sidebar"
    (mouseenter)="onMouseEnter()"
    (mouseleave)="onMouseLeave()"
  >
    <div class="sidebar-header">
      <a
        [routerLink]="['/admin']"
        class="app-logo text-2xl font-bold text-theme py-2"
      >
        Nok ExecConnect
      </a>
    </div>

    <div #menuContainer class="layout-menu-container">
      <app-menu></app-menu>
    </div>
  </div>`,
})
export class AppSidebar {
  timeout: ReturnType<typeof setTimeout> | null = null;

  @ViewChild('menuContainer') menuContainer!: ElementRef;
  public layoutService = inject(LayoutService);
  public el = inject(ElementRef);

  onMouseEnter() {
    if (!this.layoutService.layoutState().anchored) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      this.layoutService.layoutState.update((state) => {
        if (!state.sidebarActive) {
          return {
            ...state,
            sidebarActive: true,
          };
        }
        return state;
      });
    }
  }

  onMouseLeave() {
    if (!this.layoutService.layoutState().anchored) {
      if (!this.timeout) {
        this.timeout = setTimeout(() => {
          this.layoutService.layoutState.update((state) => {
            if (state.sidebarActive) {
              return {
                ...state,
                sidebarActive: false,
              };
            }
            return state;
          });
        }, 300);
      }
    }
  }
}

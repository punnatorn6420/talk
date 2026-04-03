import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../layout/service/layout.service';
import { AppBreadcrumb } from './app.breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    AppBreadcrumb,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
  ],
  template: `<div class="layout-topbar">
    <div class="topbar-start">
      <button
        #menubutton
        type="button"
        class="topbar-menubutton p-link p-trigger"
        (click)="onMenuButtonClick()"
      >
        <i class="pi pi-bars"></i>
      </button>
      <nav app-breadcrumb class="topbar-breadcrumb"></nav>
    </div>

    <div class="topbar-end">
      <ul class="topbar-menu">
        <!-- <li id="dashboard-manual-entry" class="ml-3">
          <p-button
            icon="pi pi-book"
            rounded
            pTooltip="Read the manual"
            tooltipPosition="bottom"
            (onClick)="onManualReadClick()"
          ></p-button>
        </li> -->
        <li id="dashboard-theme-config">
          <p-button
            icon="pi pi-palette"
            rounded
            pTooltip="Open configuration theme app"
            tooltipPosition="bottom"
            (onClick)="onConfigButtonClick()"
          ></p-button>
        </li>
        <li class="topbar-profile">
          <p-button
            icon="pi pi-user !text-2xl text-primary"
            rounded
            (onClick)="onProfileButtonClick()"
          ></p-button>
        </li>
      </ul>
    </div>
  </div>`,
})
export class AppTopbar {
  @ViewChild('menubutton') menuButton!: ElementRef;

  layoutService = inject(LayoutService);

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  onProfileButtonClick() {
    this.layoutService.showProfileSidebar();
  }

  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }

  onManualReadClick() {
    this.layoutService.showManualReadSidebar();
  }
}

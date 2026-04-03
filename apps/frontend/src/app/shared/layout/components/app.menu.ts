import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PermissionService } from '../../../service/permission.service';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, AppMenuitem],
  template: `<ul class="layout-menu">
    @for (item of model; track $index; let i = $index) {
      @if (!item.separator) {
        <li>
          <app-menuitem [item]="item" [index]="i" [root]="true"></app-menuitem>
        </li>
      }
      @if (item.separator) {
        <li class="menu-separator"></li>
      }
    }
  </ul> `,
})
export class AppMenu implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any[] = [];
  private permissionService = inject(PermissionService);

  ngOnInit() {
    this.model = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/admin/dashboard'],
      },
      {
        label: 'Organizations',
        icon: 'pi pi-building',
        routerLink: ['/admin/organizations'],
      },
      {
        label: 'Campaigns',
        icon: 'pi pi-megaphone',
        routerLink: ['/admin/campaigns'],
      },
      {
        label: 'Voucher Batches',
        icon: 'pi pi-ticket',
        routerLink: ['/admin/voucher-batches'],
      },
    ];

    void this.permissionService;
  }
}

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
        label: 'Message Center',
        icon: 'pi pi-home',
        routerLink: ['/admin/messages'],
      },
    ];

    void this.permissionService;
  }
}

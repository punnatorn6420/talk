import { Component, OnDestroy, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { IMail } from './mail';
import { MessageThreadService } from '../../../../service/message-thread.service';

@Component({
  selector: 'app-mail-sidebar',
  standalone: true,
  imports: [ButtonModule, RippleModule, RouterModule, CommonModule],
  template: `<div>
    <div class="overflow-auto">
      <ul
        class="flex flex-row md:flex-col gap-1 md:gap-2 list-none m-0 p-0 overflow-auto"
      >
        @for (item of items; track $index) {
          <li
            [routerLinkActive]="'bg-primary'"
            [routerLink]="item?.routerLink"
            pRipple
            class="cursor-pointer select-none p-4 duration-150 rounded flex items-center justify-center md:justify-start md:flex-1 flex-auto"
            [ngClass]="{
              'bg-primary': url === item.routerLink,
              'hover:surface-hover': url !== item.routerLink,
            }"
          >
            <i
              [class]="item.icon || ''"
              class="md:mr-4 text-surface-600 dark:text-surface-200 duration-150 text-lg"
              [ngClass]="{
                'text-white dark:text-surface-900': url === item.routerLink,
              }"
            ></i>
            <span
              class="text-surface-900 dark:text-surface-0 font-medium hidden md:inline"
              [ngClass]="{
                'text-white dark:text-surface-900': url === item.routerLink,
              }"
              >{{ item.label }}</span
            >
            @if (item.badge) {
              <span
                [ngClass]="{
                  'dark:bg-primary-900 dark:text-white':
                    url === item.routerLink,
                }"
                class="ml-auto text-sm font-semibold bg-primary-50 text-primary-900 px-2 py-1 hidden md:inline-flex items-center justify-center"
                style="border-radius: 50%; min-width: 23px; height: auto; aspect-ratio: 1; padding: 0 6px;"
              >
                {{ item.badge }}
              </span>
            }
          </li>
        }
      </ul>
    </div>
  </div>`,
})
export class MailSidebarComponent implements OnDestroy {
  items: MenuItem[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  badgeValues: any;

  mailSubscription: Subscription | undefined;

  routeSubscription: Subscription;

  url = '';

  private router = inject(Router);
  private messageThreadService = inject(MessageThreadService);

  constructor() {
    this.url = this.router.url;
    this.updateSidebar();
    this.mailSubscription = this.messageThreadService.mails$.subscribe((data) =>
      this.getBadgeValues(data),
    );

    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((params: any) => {
        this.url = params.url;
      });
  }

  getBadgeValues(data: IMail[]) {
    const inbox = [],
      starred = [],
      spam = [],
      important = [],
      archived = [],
      trash = [],
      sent = [];

    for (let i = 0; i < data.length; i++) {
      const mail = data[i];

      inbox.push(mail);
    }

    this.badgeValues = {
      inbox: inbox.length,
      starred: starred.length,
      spam: spam.length,
      important: important.length,
      archived: archived.length,
      trash: trash.length,
      sent: sent.length,
    };

    this.updateSidebar();
  }

  updateSidebar() {
    this.items = [
      {
        label: 'Inbox',
        icon: 'pi pi-inbox',
        badge: this.badgeValues.inbox,
        routerLink: '/admin/messages/inbox',
      },
      {
        label: 'Starred',
        icon: 'pi pi-star',
        badge: this.badgeValues.starred,
        routerLink: '/admin/messages/starred',
      },
      {
        label: 'Spam',
        icon: 'pi pi-ban',
        badge: this.badgeValues.spam,
        routerLink: '/admin/messages/spam',
      },
      {
        label: 'Important',
        icon: 'pi pi-bookmark',
        badge: this.badgeValues.important,
        routerLink: '/admin/messages/important',
      },
      {
        label: 'Sent',
        icon: 'pi pi-send',
        badge: this.badgeValues.sent,
        routerLink: '/admin/messages/sent',
      },
      {
        label: 'Archived',
        icon: 'pi pi-book',
        badge: this.badgeValues.archived,
        routerLink: '/admin/messages/archived',
      },
      {
        label: 'Trash',
        icon: 'pi pi-trash',
        badge: this.badgeValues.trash,
        routerLink: '/admin/messages/trash',
      },
    ];
  }

  ngOnDestroy() {
    this.mailSubscription?.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}

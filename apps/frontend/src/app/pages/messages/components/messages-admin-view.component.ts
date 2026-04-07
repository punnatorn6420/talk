import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MailService } from './ui/service/mail.service';
import { Tag } from 'primeng/tag';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

interface MailMenuItem {
  label: string;
  icon: string;
  count?: number;
  active?: boolean;
}

interface MailCategoryItem {
  label: string;
  icon: string;
  count?: number;
}

interface MailItem {
  id: number;
  from: string;
  avatar?: string;
  initials?: string;
  avatarBg?: string;
  subject: string;
  preview: string;
  time: string;
  category: string;
  unread?: boolean;
  starred?: boolean;
  bookmarked?: boolean;
  muted?: boolean;
  selected?: boolean;
  faded?: boolean;
}

@Component({
  selector: 'app-messages-admin-view',
  standalone: true,
  imports: [Tag, Checkbox, FormsModule],
  templateUrl: './messages-admin-view.component.html',
  styleUrl: './messages-admin-view.component.scss',
  providers: [MessageService, MailService],
})
export class MessagesAdminViewComponent {
  search = '';

  readonly menuItems: MailMenuItem[] = [
    { label: 'Inbox', icon: 'pi pi-inbox', count: 6, active: true },
    { label: 'Starred', icon: 'pi pi-star', count: 3 },
    { label: 'Important', icon: 'pi pi-bookmark', count: 3 },
    { label: 'Sent', icon: 'pi pi-send' },
    { label: 'Archived', icon: 'pi pi-box', count: undefined },
    { label: 'Spam', icon: 'pi pi-ban', count: 2 },
    { label: 'Trash', icon: 'pi pi-trash' },
  ];

  readonly categoryItems: MailCategoryItem[] = [
    { label: 'Social', icon: 'pi pi-users', count: 1 },
    { label: 'Updates', icon: 'pi pi-sync', count: 4 },
    { label: 'Forms', icon: 'pi pi-file-edit', count: 1 },
  ];

  mails: MailItem[] = [
    {
      id: 1,
      from: 'Brook Simmons',
      avatar: 'assets/images/avatar/avatar-square-f-1.jpg',
      subject: 'Important Account Update',
      preview: `Dear customer, we've made updates to enhance your account security...`,
      time: '3:24 PM',
      category: 'Security',
      starred: true,
      bookmarked: true,
      faded: true,
    },
    {
      id: 2,
      from: 'Dianne Russell',
      avatar: 'assets/images/avatar/avatar-square-f-2.jpg',
      subject: 'Weekly Project Update',
      preview:
        'Hi team, attached is the weekly project update. Kindly review...',
      time: '11:24 AM',
      category: 'Update',
      unread: true,
      bookmarked: true,
    },
    {
      id: 3,
      from: 'Cameron Watson',
      initials: 'CW',
      avatarBg: 'bg-slate-200',
      subject: 'Employee Appreciation Event - Save the Date',
      preview: 'Hello team, mark your calendars for our upcoming event...',
      time: 'Jan 15',
      category: 'HR',
      unread: true,
    },
    {
      id: 4,
      from: 'Amy Elsner',
      avatar: 'assets/images/avatar/profile.jpg',
      subject: 'Urgent: Security Alert - Account Compromise',
      preview: 'Dear user, we detected unauthorized access to your account...',
      time: '9:24 AM',
      category: 'Security',
      unread: true,
      starred: true,
    },
    {
      id: 5,
      from: 'Support Team',
      initials: 'ST',
      avatarBg: 'bg-slate-200',
      subject: 'Your Support Request Update',
      preview: 'Your support ticket #12345 has been resolved. Thank you...',
      time: 'Jan 08',
      category: 'Support',
      starred: true,
      faded: true,
    },
    {
      id: 6,
      from: 'Sarah Chen',
      initials: 'SC',
      avatarBg: 'bg-slate-200',
      subject: 'Q1 Budget Review Meeting',
      preview: `Hi Robert, I've prepared the Q1 budget review documents...`,
      time: 'Jan 05',
      category: 'Finance',
      starred: true,
      bookmarked: true,
    },
    {
      id: 7,
      from: 'Michael Torres',
      initials: 'MT',
      avatarBg: 'bg-slate-200',
      subject: 'New Client Onboarding - TechCorp',
      preview: 'Exciting news! TechCorp has signed with us. Please review...',
      time: 'Jan 03',
      category: 'Client',
    },
    {
      id: 8,
      from: 'Tech Support',
      initials: 'TS',
      avatarBg: 'bg-slate-200',
      subject: 'System Maintenance Scheduled',
      preview: 'Planned maintenance window: Saturday 2 AM - 4 AM...',
      time: 'Dec 26',
      category: 'System',
    },
    {
      id: 9,
      from: 'Lisa Wang',
      initials: 'LW',
      avatarBg: 'bg-slate-200',
      subject: 'Design Review - Mobile App Mockups',
      preview: 'Hi Robert, the new mobile app mockups are ready for review...',
      time: 'Dec 22',
      category: 'Design',
      starred: true,
    },
    {
      id: 10,
      from: 'James Mitchell',
      initials: 'JM',
      avatarBg: 'bg-slate-200',
      subject: 'Urgent: Server Capacity Alert',
      preview: `We're approaching 85% server capacity. Need approval...`,
      time: 'Dec 20',
      category: 'Urgent',
      starred: true,
      bookmarked: true,
    },
  ];

  get filteredMails(): MailItem[] {
    const keyword = this.search.trim().toLowerCase();

    if (!keyword) {
      return this.mails;
    }

    return this.mails.filter((mail) =>
      [mail.from, mail.subject, mail.preview, mail.category]
        .join(' ')
        .toLowerCase()
        .includes(keyword),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggleAll(event: any): void {
    const checked = !!event.checked;
    this.mails = this.mails.map((mail) => ({
      ...mail,
      selected: checked,
    }));
  }

  toggleStar(mail: MailItem): void {
    mail.starred = !mail.starred;
  }

  toggleBookmark(mail: MailItem): void {
    mail.bookmarked = !mail.bookmarked;
  }

  trackByMail(_: number, mail: MailItem): number {
    return mail.id;
  }
}

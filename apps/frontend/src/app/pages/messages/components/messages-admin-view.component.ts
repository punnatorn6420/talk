import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { MessageThreadService } from '../../../service/message-thread.service';
import { SubscriptionDestroyer } from '../../../shared/core/helper/SubscriptionDestroyer.helper';
import { IMessageThread } from '../../../types/message-thread.model';

type AdminFolder = 'INBOX' | 'SENT' | 'REPLY';

@Component({
  selector: 'app-messages-admin-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, InputTextModule, TagModule],
  templateUrl: './messages-admin-view.component.html',
  styleUrl: './messages-admin-view.component.scss',
})
export class MessagesAdminViewComponent extends SubscriptionDestroyer implements OnInit {
  private readonly threadService = inject(MessageThreadService);

  threads: IMessageThread[] = [];
  visibleThreads: IMessageThread[] = [];
  selectedThread: IMessageThread | null = null;
  search = '';
  activeFolder: AdminFolder = 'INBOX';
  replyDraft = '';

  ngOnInit(): void {
    this.AddSubscription(
      this.threadService.getThreads().subscribe((threads) => {
        this.threads = threads;
        this.applyFilters();
      }),
    );
  }

  get folders(): { key: AdminFolder; label: string; icon: string; count: number }[] {
    return [
      { key: 'INBOX', label: 'Inbox', icon: 'pi pi-inbox', count: this.threads.length },
      {
        key: 'SENT',
        label: 'Sent',
        icon: 'pi pi-send',
        count: this.threads.filter((t) => t.status === 'ANSWERED').length,
      },
      {
        key: 'REPLY',
        label: 'Reply',
        icon: 'pi pi-reply',
        count: this.threads.filter((t) => t.status !== 'ANSWERED').length,
      },
    ];
  }

  setFolder(folder: AdminFolder): void {
    this.activeFolder = folder;
    this.applyFilters();
  }

  applyFilters(): void {
    const keyword = this.search.trim().toLowerCase();
    const folderFiltered = this.threads.filter((thread) => {
      if (this.activeFolder === 'SENT') {
        return thread.status === 'ANSWERED';
      }
      if (this.activeFolder === 'REPLY') {
        return thread.status !== 'ANSWERED';
      }
      return true;
    });

    this.visibleThreads = folderFiltered.filter((thread) => {
      if (!keyword) {
        return true;
      }
      return [thread.senderName, thread.title, thread.content]
        .join(' ')
        .toLowerCase()
        .includes(keyword);
    });

    if (!this.selectedThread || !this.visibleThreads.some((t) => t.id === this.selectedThread?.id)) {
      this.selectedThread = this.visibleThreads[0] ?? null;
      this.replyDraft = '';
    }
  }

  selectThread(thread: IMessageThread): void {
    this.selectedThread = thread;
    this.replyDraft = '';
  }

  submitReply(): void {
    if (!this.selectedThread || !this.replyDraft.trim()) {
      return;
    }

    this.AddSubscription(
      this.threadService
        .replyThread(this.selectedThread.id, this.replyDraft.trim())
        .subscribe((thread) => {
          this.selectedThread = thread;
          this.replyDraft = '';
          this.applyFilters();
        }),
    );
  }

  getTagSeverity(status: IMessageThread['status']): 'success' | 'info' | 'warn' {
    if (status === 'ANSWERED') return 'success';
    if (status === 'SEEN') return 'info';
    return 'warn';
  }

  getTagLabel(status: IMessageThread['status']): string {
    if (status === 'ANSWERED') return 'Replied';
    if (status === 'SEEN') return 'Read';
    return 'New';
  }
}

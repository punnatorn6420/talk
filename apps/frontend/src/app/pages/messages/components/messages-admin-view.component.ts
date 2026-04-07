import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SubscriptionDestroyer } from '../../../shared/core/helper/SubscriptionDestroyer.helper';

@Component({
  selector: 'app-messages-admin-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
  ],
  providers: [DatePipe],
  templateUrl: './messages-admin-view.component.html',
  styleUrl: './messages-admin-view.component.scss',
})
export class MessagesAdminViewComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    /* empty */
  }
}

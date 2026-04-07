import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../../service/auth.service';
import { SubscriptionDestroyer } from '../../../shared/core/helper/SubscriptionDestroyer.helper';
import { IUserInfo } from '../../../types/auth.model';

@Component({
  selector: 'app-messages-user-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    TagModule,
  ],
  templateUrl: './messages-user-view.component.html',
})
export class MessagesUserViewComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  currentUser!: IUserInfo;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.currentUser = user;
  }
}

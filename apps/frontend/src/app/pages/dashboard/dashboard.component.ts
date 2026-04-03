import { Component } from '@angular/core';
import { SubscriptionDestroyer } from '../../shared/core/helper/SubscriptionDestroyer.helper';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [Button],
})
export class DashboardComponent extends SubscriptionDestroyer {
  constructor() {
    super();
  }
}

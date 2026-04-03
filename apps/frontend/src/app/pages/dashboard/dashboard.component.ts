import { Component } from '@angular/core';
import { SubscriptionDestroyer } from '../../shared/core/helper/SubscriptionDestroyer.helper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent extends SubscriptionDestroyer {
  constructor() {
    super();
  }
}

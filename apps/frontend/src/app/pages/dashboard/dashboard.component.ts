import { Component, OnInit } from '@angular/core';
import { SubscriptionDestroyer } from '../../shared/core/helper/SubscriptionDestroyer.helper';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  readonly shortcuts = [
    {
      title: 'Organizations',
      description: 'จัดการองค์กรและโดเมนที่ได้รับสิทธิ์',
      link: '/admin/organizations',
    },
    {
      title: 'Campaigns',
      description: 'ตั้งค่าแคมเปญส่วนลดและผูกกับ voucher batch',
      link: '/admin/campaigns',
    },
    {
      title: 'Voucher Batches',
      description: 'สร้าง batch, ดูรายละเอียด และสั่ง generate voucher',
      link: '/admin/voucher-batches',
    },
  ];

  constructor() {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {}
}

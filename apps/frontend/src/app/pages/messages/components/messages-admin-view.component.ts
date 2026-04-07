import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { SubscriptionDestroyer } from '../../../shared/core/helper/SubscriptionDestroyer.helper';

interface IMessageMockData {
  id: number;
  from: string;
  email: string;
  image: string;
  title: string;
  message: string;
  date: string;
  important: boolean;
  starred: boolean;
  trash: boolean;
  spam: boolean;
  archived: boolean;
}

@Component({
  selector: 'app-messages-admin-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, CheckboxModule],
  providers: [DatePipe],
  templateUrl: './messages-admin-view.component.html',
  styleUrl: './messages-admin-view.component.scss',
})
export class MessagesAdminViewComponent
  extends SubscriptionDestroyer
  implements OnInit
{
  readonly messages: IMessageMockData[] = [
    {
      id: 1000,
      from: 'Ioni Bowcher',
      email: 'ionibowcher@gmail.com',
      image: 'ionibowcher.png',
      title: 'Apply These 7 Secret Techniques To Improve Event  Apply These',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      date: 'May 30 2022',
      important: true,
      starred: false,
      trash: false,
      spam: false,
      archived: false,
    },
    {
      id: 1001,
      from: 'Amy Elsner',
      email: 'amyelsner@gmail.com',
      image: 'amyelsner.png',
      title:
        'Nullam purus metus, cras adipiscing magna et, aliquam gravida',
      message:
        'Iaculis nunc sed augue lacus viverra vitae. Amet porttitor eget dolor morbi non arcu. Adipiscing commodo elit at imperdiet. Scelerisque viverra mauris in aliquam. Non diam phasellus vestibulum lorem sed risus. Malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit. Curabitur vitae nunc sed velit dignissim sodales ut eu. Posuere morbi leo urna molestie at elementum eu facilisis. Commodo odio aenean sed adipiscing diam. Arcu non odio euismod lacinia at quis. Viverra suspendisse potenti nullam ac tortor vitae purus. Viverra mauris in aliquam sem fringilla ut morbi. Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida neque. Tristique senectus et netus et malesuada.',
      date: 'May 30 2022',
      important: false,
      starred: false,
      trash: true,
      spam: false,
      archived: false,
    },
    {
      id: 1002,
      from: 'Asiya Javayant',
      email: 'asiyajavayant@gmail.com',
      image: 'asiyajavayant.png',
      title:
        'Consectetur sed dis viverra lorem. Augue felis sed elit rhoncus non',
      message:
        'In tellus integer feugiat scelerisque varius. Auctor neque vitae tempus quam pellentesque nec nam aliquam. Elit pellentesque habitant morbi tristique senectus et netus. Sodales ut etiam sit amet nisl purus in. Ullamcorper morbi tincidunt ornare massa eget egestas purus. Quam vulputate dignissim suspendisse in est ante in nibh. Turpis egestas sed tempus urna et pharetra. Non curabitur gravida arcu ac tortor. Integer malesuada nunc vel risus commodo viverra maecenas accumsan lacus. Massa placerat duis ultricies lacus sed turpis tincidunt id aliquet. Varius duis at consectetur lorem. Ultricies leo integer malesuada nunc vel. Blandit massa enim nec dui. Blandit massa enim nec dui nunc mattis enim. Arcu vitae elementum curabitur vitae nunc sed velit dignissim.',
      date: 'May 28 2022',
      important: false,
      starred: false,
      trash: false,
      spam: true,
      archived: false,
    },
    {
      id: 1003,
      from: 'Xuxue Feng',
      email: 'xuexuefeng@gmail.com',
      image: 'xuxuefeng.png',
      title:
        'Eget ipsum quam eu a, sit pellentesque molestie tristique.',
      message:
        'Euismod lacinia at quis risus. Quis commodo odio aenean sed adipiscing diam donec adipiscing tristique. Risus commodo viverra maecenas accumsan.',
      date: 'May 28 2022',
      important: false,
      starred: true,
      trash: false,
      spam: false,
      archived: false,
    },
    {
      id: 1004,
      from: 'Ivan Magalhaes',
      email: 'ionibowcher@gmail.com',
      image: 'ivanmagalhaes.png',
      title:
        'Tincidunt sed vel, ipsum in tincidunt. Scelerisque lectus dolor cras',
      message:
        'Cursus mattis molestie a iaculis at erat. Nisi quis eleifend quam adipiscing vitae proin sagittis. Risus quis varius quam quisque id diam vel. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Dolor morbi non arcu risus quis varius quam quisque id. Eros donec ac odio tempor orci dapibus ultrices in.',
      date: 'May 27 2022',
      important: false,
      starred: false,
      trash: true,
      spam: false,
      archived: false,
    },
  ];

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    /* empty */
  }
}

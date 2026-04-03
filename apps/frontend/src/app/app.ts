import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppShellComponent } from './app-shell.component';

@Component({
  imports: [RouterModule, AppShellComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'frontend';
}

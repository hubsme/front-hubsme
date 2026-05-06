import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from '@component/toast/toast';
import { Alert } from '@component/alert/alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Alert],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

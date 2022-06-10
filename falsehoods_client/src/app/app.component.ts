import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'falsehoods_client';
  authService: AuthService;

  constructor(authService: AuthService)
  {
    this.authService = authService;
  }

  logout() {
    // To-Do: When Service supports Sessions and has a logout endpoint, call through that 
    this.authService.loginToken = null;
  }
}

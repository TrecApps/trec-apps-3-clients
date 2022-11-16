import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'admin_client';

  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  ngOnInit(): void {
    this.authService.refreshUser();
  }

  logout() {
    this.authService.logout();
  }

}

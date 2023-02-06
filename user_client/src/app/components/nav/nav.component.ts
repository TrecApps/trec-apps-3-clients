import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  authService: AuthService;
  constructor(authService: AuthService, private router: Router) {
    this.authService = authService;
   }

  ngOnInit(): void {
  }

  doNavigate(target: string){
    this.router.navigateByUrl(target);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/logon");
  }

}

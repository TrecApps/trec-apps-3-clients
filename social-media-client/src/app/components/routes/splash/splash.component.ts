import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.css'
})
export class SplashComponent implements OnInit{

  constructor(private authService: AuthService, private router: Router){}
  ngOnInit(): void {
    this.authService.attemptRefresh(undefined);
  }

  prepTransfer(){
    setTimeout(() => {
      if(this.authService.hasActiveTokens()){
        this.router.navigateByUrl("/home")
      } else {
        this.router.navigateByUrl("/logon")
      }
    }, 2000);
  }

}

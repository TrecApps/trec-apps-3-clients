import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MsalBroadcastService, MsalGuard, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'user_client';

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private tcAuthService:AuthService) { }

  // userPageEvents = [
  //   EventType.LOGIN_SUCCESS,
  //   EventType.ACQUIRE_TOKEN_BY_CODE_SUCCESS,
  //   EventType.ACQUIRE_TOKEN_SUCCESS
  // ];

  // sendToUserPage(msg : EventMessage) : boolean {
  //   return this.userPageEvents.includes(msg.eventType);
  // }

  ngOnInit(): void {

    console.log("Initializing Component!");

  }

}

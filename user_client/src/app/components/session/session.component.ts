import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SessionList } from 'src/app/models/Sessions';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  sessionList: SessionList | undefined;

  currentSession: string | undefined;

  constructor(private userService: UserService, private router: Router) { 
    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let endEvent : NavigationEnd = event;

        if(endEvent.url == "/sessions"){
          this.refreshSessions();
        }
      }
      
    })
  }

  ngOnInit(): void {
  }

  refreshSessions() {
    this.userService.getSessions((sessionList : SessionList) => {
      this.sessionList = sessionList;
      console.log("Got Session!");
    },
      (currentSession: string) => {
        this.currentSession = currentSession;
        console.log("Current Session is ", this.currentSession);
      });
  }

  deleteSession(sessionId: string) {
    this.userService.removeSession(sessionId, () => this.refreshSessions());
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MessagePaneHolderComponent } from './components/message-pane-holder/message-pane-holder.component';
import { HostListener } from "@angular/core";
import { DisplayService } from './services/display.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MessagePaneHolderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'social-media-client';

  screenHeight: number;
  screenWidth: number;
  displayService: DisplayService;

  constructor(displayService: DisplayService, private authService: AuthService) {
    this.screenHeight = 0;
    this.screenWidth = 0;
    this.displayService = displayService;
    this.getScreenSize();
  }

  ngOnInit(): void {
    this.authService.attemptRefresh(undefined);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(_event?: any) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    this.displayService.setMobile(this.screenWidth < 768);
    this.displayService.setScreenHeight(this.screenHeight);
  }
}

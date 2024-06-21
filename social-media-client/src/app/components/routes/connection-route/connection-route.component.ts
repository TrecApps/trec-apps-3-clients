import { Component } from '@angular/core';
import { DisplayService } from '../../../services/display.service';
import { MobileBarComponent } from '../../repeats/mobile-bar/mobile-bar.component';
import { ConnectionListComponent } from '../../repeats/connection-list/connection-list.component';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection-route',
  standalone: true,
  imports: [CommonModule, MobileBarComponent, ConnectionListComponent],
  templateUrl: './connection-route.component.html',
  styleUrl: './connection-route.component.css'
})
export class ConnectionRouteComponent {
  displayService: DisplayService;
  userService: UserService;
  

  constructor(ds: DisplayService, us: UserService) {
    this.displayService = ds;
    this.userService = us;
  }
}

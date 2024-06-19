import { Component } from '@angular/core';
import { DisplayService } from '../../../services/display.service';
import { MobileBarComponent } from '../../repeats/mobile-bar/mobile-bar.component';
import { ConnectionListComponent } from '../../repeats/connection-list/connection-list.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-connection-route',
  standalone: true,
  imports: [MobileBarComponent, ConnectionListComponent],
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

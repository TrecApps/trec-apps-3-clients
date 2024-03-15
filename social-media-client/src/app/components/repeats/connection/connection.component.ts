import { Component, Input, OnInit } from '@angular/core';
import { ConnectionEntry, ConnectionType } from '../../../models/Connection';
import { environment } from '../../../environments/environment';
import { Profile } from '../../../models/ProfileObjs';
import { ProfileService } from '../../../services/profile.service';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ConnectionService } from '../../../services/connection.service';
import { ResponseObj } from '../../../models/ResponseObj';

@Component({
  selector: 'app-connection',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.css'
})
export class ConnectionComponent implements OnInit{

  imgUrlDefault: string; 
  imgUrl: string;

  target: string | undefined;

  @Input()
  conn: ConnectionEntry = new ConnectionEntry();

  @Input()
  connectionOwner: string | undefined;

  profile: Profile | undefined;

  one_way_con: ConnectionType = ConnectionType.ONE_WAY;
  confirm_con: ConnectionType = ConnectionType.CONFIRMED;
  request_con: ConnectionType = ConnectionType.ONE_WAY;

  constructor(private profileService: ProfileService, private router: Router, private connectionService: ConnectionService){
    this.imgUrlDefault = "/assets/icons/non-profile.png";
    this.imgUrl = this.imgUrlDefault;
  }

  routeToProfile(){
    if(this.target)
    this.router.navigate(['profile'], {queryParams:{
      id: this.target
    }})
  }

  ngOnInit(): void {

    if(!this.connectionOwner) return;

    this.target = this.conn.requestee;

    if(this.target == this.conn.requestee){
      this.target = this.conn.requester;
    }

    let idSplit = this.target.split("-");

    let actId = idSplit.at(1);

    

    if(actId)
    {
      this.profileService.getProfile(actId).subscribe({
        next: (p: Profile) => this.profile = p
      })

      if(idSplit.at(0) == "User") {
        this.imgUrl = `${environment.image_service_url}Profile/of/${actId}?app=${environment.app_name}`;
      } else {
        this.imgUrl = `${environment.image_service_url}Profile/byBrand/${actId}?app=${environment.app_name}`;
      }
    }

    
  }

  deleteConnection(id: number){
    this.connectionService.removeConnection(id).subscribe({
      next: (ro: ResponseObj) => {
        alert(ro.message);
        this.profile = undefined;
      }
    })
  }

  connectionResponse(target: string, confirm: boolean) {
    this.connectionService.makeConnectionResponse(target, confirm).subscribe({
      next: (ro: ResponseObj)=> {
        if(confirm) 
          this.conn.type = ConnectionType.CONFIRMED
        else this.profile = undefined;
      }
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { Requester } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
  }

  requesters: Requester[] = [];

  refreshUsers() {
    this.requesters = [];
    this.requesters.length;
    this.adminService.getRequesters((req: Requester) => this.requesters.push(req));
  }

  populateEvidence(req:Requester) {
    req.verifyPics = [];
    this.adminService.retrieveEvidence(req);
  }
}

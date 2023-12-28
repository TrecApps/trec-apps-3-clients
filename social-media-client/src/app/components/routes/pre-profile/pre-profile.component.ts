import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileCreateBody } from '../../../models/ProfileObjs';
import { PreProfileService } from '../../../services/links/pre-profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pre-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pre-profile.component.html',
  styleUrl: './pre-profile.component.css'
})
export class PreProfileComponent {

  preProfileService: PreProfileService;

  constructor(preProfileService: PreProfileService){
    this.preProfileService = preProfileService;
  }

}

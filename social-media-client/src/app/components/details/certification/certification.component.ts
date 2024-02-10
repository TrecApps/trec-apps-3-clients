import { Component, Input } from '@angular/core';
import { Certifications, MONTH_LIST } from '../../../models/ProfileDetails';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileDetailsService } from '../../../services/profile-details.service';

@Component({
  selector: 'app-certification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.css'
})
export class CertificationComponent {

  @Input()
  isEditing: boolean | undefined;

  @Input()
  certification: Certifications = new Certifications();

  monthList:String[];
  constructor(private profileDetailsService: ProfileDetailsService){
    this.monthList = MONTH_LIST;
  }

  saveCertification(){
    
  }
}

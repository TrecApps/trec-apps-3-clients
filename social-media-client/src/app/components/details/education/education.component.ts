import { Component, Input } from '@angular/core';
import { Education, MONTH_LIST } from '../../../models/ProfileDetails';
import { ProfileDetailsService } from '../../../services/profile-details.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandInfo } from '../../../models/BrandInfo';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent {

  @Input()
  isEditing: boolean | undefined;

  @Input()
  education: Education = new Education();

  institution: string = "";
  institutionList: BrandInfo[] = [];

  monthList:String[];
  showGpa: boolean = true;

  currentMajor = "";
  removeMajor(i: number){
    this.education.majors.splice(i,1);
  }
  addToMajor(){
    let trimmedMajor = this.currentMajor.trim();
    if(trimmedMajor){
      this.education.majors.push(trimmedMajor);
      this.currentMajor = "";
    }
  }

  currentMinor = "";
  removeMinor(i: number){
    this.education.minors.splice(i,1);
  }
  addToMinjor(){
    let trimmedMinor = this.currentMinor.trim();
    if(trimmedMinor){
      this.education.minors.push(trimmedMinor);
      this.currentMinor = "";
    }
  }

  constructor(private profileDetailsService: ProfileDetailsService){
    this.monthList = MONTH_LIST;
  }

  saveEducation(){
    
  }
}

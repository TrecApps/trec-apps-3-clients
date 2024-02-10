import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Education, Experience, MONTH_LIST } from '../../../models/ProfileDetails';
import { ProfileDetailsService } from '../../../services/profile-details.service';
import { FormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
  animations: [
    trigger('doShowDetails', [
      state('collapse', style({ height: '0px', overflow: 'hidden'})),
      state('expanded', style({ height: '*', overflow: 'hidden'})),
      transition('collapse => expanded', [ animate('0.33s')]),
      transition('expanded => collapse', [animate('0.33s')])
    ]),
    trigger('rotate', [
      state('collapse', style({ transform: 'rotate(180deg)'})),
      state('expanded', style({ transform: 'rotate(270deg)'})),
      transition('collapse => expanded', [ animate('0.33s')]),
      transition('expanded => collapse', [animate('0.33s')])
    ])
  ]
})
export class ExperienceComponent {
  @Input()
  isEditing: boolean | undefined;

  @Input()
  isSelfProfile: boolean = false;

  @Input()
  experience: Experience = new Experience();

  complexDesc: String = "";
  removeComplexDesc(i: number){
    this.experience.complexDescription.splice(i, 1);
  }
  addToComplexDesc(){
    let trimmedDesc = this.complexDesc.trim();
    if(trimmedDesc){
      this.experience.complexDescription.push(trimmedDesc);
      this.complexDesc = "";
    }
  }

  institution: string = "";
  //institutionList: BrandInfo[] = [];

  monthList:String[];
  experienceType: String[] = [
    "Professional",
    "Personal",
    "Educational",
    "Career Break",
    "Recreational",
    "Legal",
    "Military"
  ];

  showSubExperiences: boolean = true;

  toggleShowSubExperiences(){
    this.showSubExperiences = !this.showSubExperiences;
  }

  constructor(private profileDetailsService: ProfileDetailsService){
    this.monthList = MONTH_LIST;
  }

  saveExperience(){
    
  }

  addSubExperience(){
    
  }
}

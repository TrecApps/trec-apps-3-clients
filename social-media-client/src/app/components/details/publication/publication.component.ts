import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MONTH_LIST, PubContributor, Publication } from '../../../models/ProfileDetails';
import { ProfileDetailsService } from '../../../services/profile-details.service';

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publication.component.html',
  styleUrl: './publication.component.css'
})
export class PublicationComponent {
  @Input()
  isEditing: boolean | undefined;

  @Input()
  publication: Publication = new Publication();

  currentContributor: PubContributor = new PubContributor("", "");

  monthList: String[];
  removeContributor(i: number){
    this.publication.contributors.splice(i, 1);
  }
  addContributor(){
    let useContributor = new PubContributor(this.currentContributor.contributor.trim(), this.currentContributor.contributionType.trim());
    if(useContributor.contributor){
      this.publication.contributors.push(useContributor);
      this.currentContributor = new PubContributor("", "");
    }
  }

  constructor(private profileDetailsService: ProfileDetailsService){
    this.monthList = MONTH_LIST;
  }

  savePublication(){
    
  }
}

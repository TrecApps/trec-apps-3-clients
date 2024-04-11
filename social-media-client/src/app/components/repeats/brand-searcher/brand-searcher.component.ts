import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { BrandResourceGetService } from '../../../services/brand-resource-get.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextGenerationService } from '../../../services/text-generation.service';
import { BrandInfo, BrandInfoImg } from '../../../models/BrandInfo';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-brand-searcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './brand-searcher.component.html',
  styleUrl: './brand-searcher.component.css'
})
export class BrandSearcherComponent implements OnDestroy{

  @Input()
  type: string | undefined;

  @Output()
  brandInfoSelected = new EventEmitter<BrandInfo>();

  @Input()
  label: string = "Search Brand";

  selectionName: string;

  name: string = "";

  entries: BrandInfoImg[] = [];

  showOptions: boolean = true;

  constructor(private brandGetService: BrandResourceGetService, private textGenerationService: TextGenerationService){
    this.selectionName = textGenerationService.generateText();
  }

  ngOnDestroy(): void {
    this.textGenerationService.freeText(this.selectionName);
  }

  onInputTextedClicked(){
    this.showOptions = true;
  }

  onInputChange() {

    let tempName = this.name.trim();
    if(tempName){
      let observable: Observable<BrandInfoImg[]> = this.type ?
       this.brandGetService.getBrandsByNameAndType(tempName, this.type) : this.brandGetService.getBrandsByName(tempName);
       observable.subscribe({
        next: (brands: BrandInfoImg[]) => this.entries = brands
       });
    } else {
      this.entries = [];
    }
  }

  onBrandSelected(selection: BrandInfo){
    this.showOptions = false;
    this.brandInfoSelected.emit(selection);
  }

}

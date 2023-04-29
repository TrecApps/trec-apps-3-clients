import { Component } from '@angular/core';
import { BrandInfo, BrandInfoContainer } from 'src/app/models/Brands';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent {

  constructor(private subjectService: SubjectService){}


  brands: BrandInfo[] = [];

  searchMode = true;
  searchAll = false;
  searchName = "";
  usingNameSearch = true;

  page = 0;
  size = 20;

  mainBrand : BrandInfoContainer | undefined;
  subjectType="";

  permittedFileTypes = [
    "gif",
    "jpeg",
    "png",
    "svg",
    "webp"];


    searchByName(){
      console.log("Search by Name using " + this.searchName);
      this.subjectService.searchByName(this.searchName, (res: BrandInfo[]) => {
        while(this.brands.pop());
        for(let brand of res){
          this.brands.push(brand);
        }
      });
    }
  
    searchByAll(){
      this.subjectService.list((res: BrandInfo[]) => {
        while(this.brands.pop());
        for(let brand of res){
          this.brands.push(brand);
        }
      }, this.page, this.size);
    }
  
    toggleSearchMode(){
      this.usingNameSearch = !this.usingNameSearch;
    }
  
    seekBrand(id:string){
      this.mainBrand = new BrandInfoContainer();
      this.subjectService.populateBrand(this.mainBrand, id, () => {
        if(this.mainBrand?.brandInfo?.resourceType)
          this.subjectType = this.mainBrand.brandInfo.resourceType;
      });
      this.searchMode = false;
    }

    revertToSearch(){
      this.searchMode = true;
    }
}

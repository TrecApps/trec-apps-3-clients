import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrandEntry, TcBrand } from 'src/app/models/Brand';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {


  brandIdList: BrandEntry[] = [];
  brandList: TcBrand[] = [];

  selectedFile:File | undefined;
  selectedFileType: string| undefined;
  permittedFileTypes = [
    "gif",
    "jpeg",
    "png",
    "svg",
    "webp"];
  selectedBrand: TcBrand | undefined;

  retrieved = false;

  newName: string = "";

  constructor(private brandService: BrandService, private router:Router) { }

  ngOnInit(): void {
  }

  getBrands(){
    this.brandIdList = [];

    this.brandService.getBrandList((list: BrandEntry[]) => {
      this.brandIdList = list;
      this.retrieved = true;
      for(let entry of this.brandIdList){
        this.brandService.getBrand(entry.id, this.brandList, (brand: TcBrand) => {
          this.brandService.retrieveProfilePic(brand);
        });
      }
    })
  }

  submitNew() {
    let actName = this.newName.trim();
    console.log("Brand name " + actName + " has a length of "+ actName.length);
    if(actName.length){
      this.brandService.newBrand(actName, () => {this.getBrands()});
    }
  }

  updateProfilePic() {
    this.selectedFile?.arrayBuffer().then((value: ArrayBuffer)=> {
      let buffer = new Uint8Array(value);

      const STRING_CHAR = buffer.reduce((data, byte)=> {return data + String.fromCharCode(byte);}, '');

      let data = btoa(STRING_CHAR);

      let t = this.selectedFileType?.split('/');
      let ty = t?.pop();
      if(ty && this.selectedBrand){
      this.brandService.changeBrandPic(data, ty, this.selectedBrand);
      }
    }).catch();
  }


  onFileChanged(event: any, id: string) {

    this.selectedFile = event.target.files[0]
    console.log("File Selectd: " + this.selectedFile);
    if(!this.selectedFile)return;

    let t = this.selectedFile.type.toLowerCase().trim();
    console.log("File Type is " + this.selectedFile.type + " ("+ t +") and name is " + this.selectedFile.name);
    for(let possibleType of this.permittedFileTypes) {
      if(t == `image/${possibleType}`)
      {
        this.selectedFileType = possibleType;
        break;
      }
    }
    console.log("Selected File type is " + this.selectedFileType);
    for(let brand of this.brandList){
      if(brand.id == id){
        this.selectedBrand = brand;
        break;
      }
    }

  }

  routeToUserManagement(){
    this.router.navigate(['user']);
  }

}

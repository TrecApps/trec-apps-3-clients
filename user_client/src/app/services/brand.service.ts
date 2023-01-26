import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BrandEntry, TcBrand } from '../models/Brand';
import { AuthService } from './auth.service';
import { Buffer } from 'buffer/';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  brandProfileFallback = "/assets/Unknown_Profile.png";



  constructor(private httpClient: HttpClient, private authService: AuthService, private router: Router) {

   }

  error = (error: Response | any) => { 
        alert((error instanceof Response) ? error.text : (error.message ? error.message : error.toString()));
        if(error?.status == 401 || error ?.status == 403) {
          this.authService.clearAuth();
          this.router.navigate(['logon']);
        }
      }

  getBrandList(reciever: Function){
    let observe = {
      next: (list: BrandEntry[]) => {
        reciever(list);
      },
      error: this.error
    }

    this.httpClient.get<BrandEntry[]>(`${environment.user_service_url}Brands/list`, {headers: this.authService.getHttpHeaders(false, false)}).subscribe(observe);
  }

  getBrand(id: string, brandList: TcBrand[], callable: Function) {
    let observe = {
      next: (brand: TcBrand) => {
        brandList.push(brand);
        callable(brand);
      },
      error: this.error
    }

    this.httpClient.get<TcBrand>(`${environment.user_service_url}Brands/${id}`,{headers: this.authService.getHttpHeaders(false, false)}).subscribe(observe);
  }

  newBrand(name: string, callable: Function){
    let observe = {
      next: () => {
        alert(`Brand Name ${name} successfuly added!`);
        callable();
      },
      error: this.error
    }

    let headers = this.authService.getHttpHeaders(false, false);
    headers = headers.append('Content-Type', 'text/plain');

    this.httpClient.post(`${environment.user_service_url}/Brands/New`, name, {headers}).subscribe(observe);
  }

  retrieveProfilePic(brand:TcBrand){
    // brand.profile = this.brandProfileFallback;
    // let observe = {
    //   next: (response: Response) => {
    //     let type = response.headers.get("content-type");
    //     response.arrayBuffer().then((data: ArrayBuffer) => {
    //       let bData = new Uint8Array(data);
        
    //       brand.profile = `data:${type};base64,${Buffer.from(bData).toString('base64')}`
    //     })
    //   },
    //   error: this.error
    // }

    // let headers = this.authService.getHttpHeaders(true, false);
    //       headers = headers.append("Accept", `image/*`);

    // this.httpClient.get(`${environment.user_service_url}/brandProfile/profilePic/${brand.id}`,
    //  {headers, responseType: 'arraybuffer'}).subscribe(observe);

    let observe = {
      next: (ext: string) => {
        console.log("Retrieving Image with "+ ext);
        let headers = this.authService.getHttpHeaders(true, false);
           headers = headers.append("Accept", `image/${ext}`);
        
           this.httpClient.request('GET', `${environment.user_service_url}brandProfile/file/${brand.id}.${ext}`, 
           {headers: headers, responseType: 'arraybuffer'}).pipe(take(1)).subscribe({
             next: (data: ArrayBuffer) => {
             
               let bData = new Uint8Array(data);
               
               brand.profile = `data:image/${ext};base64,${Buffer.from(bData).toString('base64')}`;
           }
          });
      },
      error: this.error
    };

    this.httpClient.request('GET', `${environment.user_service_url}brandProfile/imageType/${brand.id}`,
     {headers: this.authService.getHttpHeaders(false, false), responseType: 'text'}).subscribe(observe);
  }

  changeBrandPic(data:string, ext:string, brand: TcBrand){
    let header = this.authService.getHttpHeaders(true, false).append("Content-Type", `image/${ext}`);

    let observe = {
      next: () => {
        this.retrieveProfilePic(brand);
      },
      error: this.error
    }

    this.httpClient.post(`${environment.user_service_url}brandProfile/set?brandId=${brand.id}`, data,{headers: header}).pipe(take(1)).subscribe(observe);
  }

}

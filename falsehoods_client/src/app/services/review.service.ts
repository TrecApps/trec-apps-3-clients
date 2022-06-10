import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { StringWrapper } from '../../../../angular_common/Models/Common';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private httpClient: HttpClient, private authService: AuthService){

   }

   /**
    * Submits a review of an entry against a MEDIA Falsehood entry
    * @param verdict string that can contain the values 'Approve', 'Reject', or 'Penalize'
    * @param data form data that needs to contain 'Falsehood' that is the number id of the falsehood in question and
    *   'Comment' which is a tring representing the reviewers take on the falsehood entry he/she is reviewing (i.e. the 'why' behind the verdict)
    * @param ret 
    */
   async ReviewMediaFalsehood(verdict: string, data: FormData, ret: StringWrapper){

    let observe = {
      next: (response: Object) => { ret.content = response.toString();},
      error: (error: Response | any) => { 
        ret.content = (error instanceof Response) ? error.text : (error.message ? error.message : error.toString());
      }
    };
  
    this.httpClient.post(`${environment.falsehood_review_url}/Media/${verdict}`,
      data, {
        headers: {
          Authorization: this.authService.getAuthorization()
     }}).pipe(take(1)).subscribe(observe);
   }

   
   /**
    * Submits a review of an entry against a Public Falsehood entry
    * @param verdict string that can contain the values 'Approve', 'Reject', or 'Penalize'
    * @param data form data that needs to contain 'Falsehood' that is the number id of the falsehood in question and
    *   'Comment' which is a tring representing the reviewers take on the falsehood entry he/she is reviewing (i.e. the 'why' behind the verdict)
    * @param ret 
    */
    async ReviewPublicFalsehood(verdict: string, data: FormData, ret: StringWrapper){

      let observe = {
        next: (response: Object) => { ret.content = response.toString();},
        error: (error: Response | any) => { 
          ret.content = (error instanceof Response) ? error.text : (error.message ? error.message : error.toString());
        }
      };
    
      this.httpClient.post(`${environment.falsehood_review_url}/Public/${verdict}`,
        data, {
          headers: {
            Authorization: this.authService.getAuthorization()
       }}).pipe(take(1)).subscribe(observe);
     }
  
}

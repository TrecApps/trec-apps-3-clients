import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MediaFalsehoodComponent } from '../components/media-falsehood/media-falsehood.component';
import { PublicFalsehoodComponent } from '../components/public-falsehood/public-falsehood.component';
import { MediaFalsehood } from '../models/media.falsehood';
import { FullPublicFalsehood, PublicFalsehood } from '../models/public.falsehood';

@Injectable({
  providedIn: 'root'
})
export class FalsehoodSetService {

  publicFalsehoodComponent: PublicFalsehoodComponent | undefined;
  mediaFalsehoodComponent: MediaFalsehoodComponent | undefined;

  constructor(private router: Router) { }

  setPublicComponent(publicFalsehoodComponent: PublicFalsehoodComponent) {
    this.publicFalsehoodComponent = publicFalsehoodComponent;
  }

  setMediaComponent(mediaFalsehoodComponent: MediaFalsehoodComponent){
    this.mediaFalsehoodComponent = mediaFalsehoodComponent;
  }

  setPublicFalsehood(publicFalsehood : PublicFalsehood) {
    if(this.publicFalsehoodComponent){
      this.router.navigate(['PublicFalsehoods']);
      this.publicFalsehoodComponent.selectPublicFalsehood(publicFalsehood);
    }
  }

  setMediaFalsehood(mediaFalsehood : MediaFalsehood) {
    if(this.mediaFalsehoodComponent){
      this.router.navigate(['MediaFalsehoods']);
      this.mediaFalsehoodComponent.selectMediaFalsehood(mediaFalsehood);
    }
  }
}

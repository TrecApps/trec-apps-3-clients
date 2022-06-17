import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PublicFigureComponent } from './components/public-figure/public-figure.component';
import { MediaOutletComponent } from './components/media-outlet/media-outlet.component';
import { PublicFalsehoodComponent } from './components/public-falsehood/public-falsehood.component';
import { MediaFalsehoodComponent } from './components/media-falsehood/media-falsehood.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    PublicFigureComponent,
    MediaOutletComponent,
    PublicFalsehoodComponent,
    MediaFalsehoodComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

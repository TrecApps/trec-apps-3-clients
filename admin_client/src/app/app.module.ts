import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FigureComponent } from './components/figure/figure.component';
import { InstitutionComponent } from './components/institution/institution.component';
import { LoginComponent } from './components/login/login.component';
import { OutletComponent } from './components/outlet/outlet.component';
import { RegionComponent } from './components/region/region.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MarkedPipe } from './resources/marked.pipe';
import { VerifyComponent } from './components/verify/verify.component';

@NgModule({
  declarations: [
    MarkedPipe,
    AppComponent,
    RegionComponent,
    InstitutionComponent,
    FigureComponent,
    OutletComponent,
    WelcomeComponent,
    LoginComponent,
    VerifyComponent
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

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
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { MarkdownComponent } from './components/markdown/markdown.component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
    VerifyComponent,
    SubscriptionComponent,
    MarkdownComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { FactcheckComponent } from './components/factcheck/factcheck.component';
import { FalsehoodComponent } from './components/falsehood/falsehood.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SubjectComponent } from './components/subject/subject.component';
import { MarkedPipe } from './pipes/marked.pipe';
import { ObjNgFor } from './pipes/object.pipe';
import { TextFieldModule } from "@angular/cdk/text-field";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LoginComponent,
    FactcheckComponent,
    FalsehoodComponent,
    SubjectComponent,
    MarkedPipe,
    ObjNgFor
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TextFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

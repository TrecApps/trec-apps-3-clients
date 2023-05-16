import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FalsehoodComponent } from './components/falsehood/falsehood.component';
import { FactcheckComponent } from './components/factcheck/factcheck.component';
import { SubjectComponent } from './components/subject/subject.component';

const routes: Routes = [
  { path: 'Login', component: LoginComponent},
  { path: 'Welcome', component: WelcomeComponent },
  { path: 'Subject', component: SubjectComponent},
  { path: 'Falsehood', component: FalsehoodComponent},
  { path: 'Factcheck', component: FactcheckComponent},
  { path: '',   redirectTo: '/Welcome', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

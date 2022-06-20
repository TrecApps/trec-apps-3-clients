import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MediaFalsehoodComponent } from './components/media-falsehood/media-falsehood.component';
import { MediaOutletComponent } from './components/media-outlet/media-outlet.component';
import { PublicFalsehoodComponent } from './components/public-falsehood/public-falsehood.component';
import { PublicFigureComponent } from './components/public-figure/public-figure.component';
import { WelcomeComponent } from './components/welcome/welcome.component';



const routes: Routes = [
	{ path: 'Welcome', component: WelcomeComponent},
  { path: 'MediaFalsehoods', component: MediaFalsehoodComponent },
  { path: 'PublicFalsehoods', component: PublicFalsehoodComponent },
  // { path: 'Regions', component: RegionComponent },
  // { path: 'Institution', component: InstitutionComponent},
  { path: 'PublicFigure', component: PublicFigureComponent},
  { path: 'MediaOutlet', component: MediaOutletComponent},
  { path: 'login', component: LoginComponent},
  { path: '',   redirectTo: '/Welcome', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
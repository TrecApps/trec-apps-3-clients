import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FigureComponent } from './components/figure/figure.component';
import { InstitutionComponent } from './components/institution/institution.component';
import { LoginComponent } from './components/login/login.component';
import { OutletComponent } from './components/outlet/outlet.component';
import { RegionComponent } from './components/region/region.component';
import { VerifyComponent } from './components/verify/verify.component';

const routes: Routes = [
  { path: 'Login', component: LoginComponent},
  { path: 'Regions', component: RegionComponent },
  { path: 'Institution', component: InstitutionComponent},
  { path: 'PublicFigure', component: FigureComponent},
  { path: 'MediaOutlet', component: OutletComponent},
  { path: 'verifyId', component: VerifyComponent},
  { path: '',   redirectTo: '/Welcome', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

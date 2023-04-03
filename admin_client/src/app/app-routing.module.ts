import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandComponent } from './components/brand/brand.component';
import { FigureComponent } from './components/figure/figure.component';
import { InstitutionComponent } from './components/institution/institution.component';
import { LoginComponent } from './components/login/login.component';
import { OutletComponent } from './components/outlet/outlet.component';
import { RegionComponent } from './components/region/region.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { VerifyComponent } from './components/verify/verify.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  { path: 'Login', component: LoginComponent},
  { path: 'Welcome', component: WelcomeComponent },
  { path: 'Regions', component: RegionComponent },
  { path: 'Institution', component: InstitutionComponent},
  { path: 'PublicFigure', component: FigureComponent},
  { path: 'MediaOutlet', component: OutletComponent},
  { path: 'Subject', component: BrandComponent},
  { path: 'verifyId', component: VerifyComponent},
  { path: 'Subscription', component: SubscriptionComponent},
  { path: '',   redirectTo: '/Welcome', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

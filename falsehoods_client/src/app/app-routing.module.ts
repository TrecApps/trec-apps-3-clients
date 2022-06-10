import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
	// { path: 'Welcome', component: WelcomeComponent},
  // { path: 'Falsehoods', component: FalsehoodsComponent },
  // { path: 'PublicFalsehoods', component: PublicFalsehoodsComponent },
  // { path: 'Regions', component: RegionComponent },
  // { path: 'Institution', component: InstitutionComponent},
  // { path: 'PublicFigure', component: PublicFigureComponent},
  // { path: 'MediaOutlet', component: MediaOutletComponent},
  // { path: '',   redirectTo: '/Welcome', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
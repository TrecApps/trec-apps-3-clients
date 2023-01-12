import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandsComponent } from './components/brands/brands.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { LoginComponent } from './components/login/login.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';



const routes: Routes = [
  {path: 'logon', component: LoginComponent},
  {path: 'create', component: CreateUserComponent},
  {path: 'user', component: ManageUserComponent},
  {path: 'brands', component: BrandsComponent},
  {path: 'subscriptions', component: SubscriptionComponent},
  {path: '', redirectTo: 'logon', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
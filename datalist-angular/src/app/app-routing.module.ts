import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { TableTemplateComponent } from './components/table-template/table-template.component';

const routes: Routes = [
	{ path: 'Login', component: LoginComponent},
  { path: 'Home', component: MainComponent },
  { path: 'Template', component: TableTemplateComponent},
  //{ path: 'History', component: SiteHistoryComponent},
  { path: '',   redirectTo: '/Login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MsalModule } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: 'Enter_the_Application_Id_here',
        //authority: 'Enter_the_Cloud_Instance_Id_Here'/'Enter_the_Tenant_Info_Here',
        redirectUri: 'Enter_the_Redirect_Uri_Here'
      },
      cache: {
        cacheLocation: 'localStorage'
      }
    }), null, null)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

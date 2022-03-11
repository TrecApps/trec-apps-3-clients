import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  username: string;
  password: string;

  constructor(private authService: AuthService) { 
    this.username = "";
    this.password = "";
  }

  ngOnInit(): void {
  }

  useOnMicrosoft() {
    // I plan on worrying about this later, though, if you are up to it, I found a document that might be of use:
    // https://docs.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-angular-auth-code

    // If you do choose to add this functionality, I personally would prefer the pop-up window option. 
    // I will provide the necessary parameters when it comes time to test in real life

    alert("You are about to be taken to On-Microsoft to login, but you will still use your Trec-Account Credentials!\n\v" +
    "Trec-Apps uses Azure Active Directory behind the scenes!");

    this.authService.loginViaMicrosoft();
  }

  loginManually() {
    this.authService.loginViaTrecApps(this.username, this.password).then((result: string) => {
      if(result.length) {
        // Print Error Message
      } else {
        // Redirect to other page
      }
    })
  }

  createAccount() {
    // In test enviroments, I plan on blocking this functionality all together and instead manually create accounts
    // should this functionality be implemented, one would redirect (though if we could use a pop-up window, that would be great)
    // To the trec-apps user service
  }
}

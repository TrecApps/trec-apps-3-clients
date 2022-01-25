export class PasswordChange {
    currentPassword: string;
    newPassword: string;
    constructor(currentPassword:string, newPassword:string){
        this.newPassword = newPassword;
        this.currentPassword = currentPassword;
    }
}

export class PasswordProfile {
    forceChangePasswordNextSignIn = false;

    forceChangePasswordNextSignInWithMfa = false;

    password: string;

    constructor(password: string) {
        this.password = password;
    }
}


export class PasswordProfile {
    password: string;
    constructor(password:string) {
        this.password = password;
    }
}

export class UserPost {
    
    displayName : string | undefined;
    mailNickname : string | undefined;
    userPrincipalName : string | undefined;
    passwordProfile: PasswordProfile | undefined;
    mobilePhone : string | undefined;
    birthday: Date | undefined;
    mail : string | undefined;
}


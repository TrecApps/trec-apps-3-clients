

export class PasswordProfile {
    password: string | undefined;
}

export class UserPost {
    
    displayName : string | undefined;
    mailNickname : string | undefined;
    userPrincipalName : string | undefined;
    passwordProfile: PasswordProfile | undefined;
    mobilePhone : string | undefined;
    birthday: Date | undefined;
    mail : string | undefined;

    validate() : boolean {
        return !!(this.displayName && this.userPrincipalName && this.passwordProfile?.password &&
            this.mobilePhone && this.birthday && this.mail);

    }
}

export class TcUser {
    id : string | undefined;
    displayName : string | undefined;
    userProfile : string | undefined;
    mobilePhone : string | undefined;
    phoneVerified: boolean | undefined;

    email : string | undefined;
    emailVerified : boolean | undefined;

    birthday: Date | undefined;
    birthdaySetting: string | undefined;

    address: string[] | undefined;
    restrictions: string | undefined;

    credibilityRating: number | undefined;

    
}
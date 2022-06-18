

export class PasswordChange {
    currentPassword: string | undefined;
    newPassword: string | undefined;
}

export class Login {
    username: string | undefined;
    password:string|undefined;
}

export class LoginToken {
    access_token: string | undefined;
    token_type: string | undefined;
    refresh_token: string | undefined;
    id_token: string | undefined | null;

    expires_in: number| undefined;

    toString(): string {
        return `access_token = [hidden], token_type = ${this.token_type}, refresh_token = [hidden], expires_in = ${this.expires_in}`;
    }
}

export class UserInfo {
    username: string;
    credibility: number;

    constructor(username: string, credibility: number){
        this.username = username;
        this.credibility = credibility;
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
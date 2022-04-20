

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
    id_token: string | undefined;

    expires_in: number| undefined;
}
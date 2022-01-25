
export class Login {
    username: string;
    password: string;
    constructor(username:string, password:string){
        this.password = password;
        this.username = username;
    }
}

export class LoginTokin {
    access_token: string;
    token_type: string; 
    refresh_token: string;
    id_token: string;

    expires_in: number;

    constructor(access_token: string,
        token_type: string,
        refresh_token: string,
        id_token: string,
    
        expires_in: number) {
            this.access_token = access_token;
            this.refresh_token = refresh_token;
            this.id_token = id_token;
            this.token_type = token_type;
            
            this.expires_in = expires_in;
        }
}
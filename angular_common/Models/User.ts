import { PasswordProfile } from "./Password";

export class UserPost {
    accountEnabled = true;
    displayName: string;
    mailNickname: string;
    userPrincipalName: string;
    passwordProfile: PasswordProfile;
    mobilePhone: string;
    birthday: Date;
    mail: string;

    otherMails: string[];
}
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
export class PhoneNumber {
    number : number = 0;
    countryCode: number = 0;
}

export class TcUser {
    id : String | undefined;
    displayName : string | undefined;
    userProfile : string | undefined;
    mobilePhone : PhoneNumber | undefined;
    phoneVerified: boolean | undefined;

    email : string | undefined;
    emailVerified : boolean | undefined;

    birthday: Date | undefined;
    birthdaySetting: string | undefined;

    address: string[] | undefined;
    restrictions: string | undefined;

    credibilityRating: number | undefined;

    profilePics: Object | undefined;
}
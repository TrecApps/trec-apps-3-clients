export class Certifications {
    id: number | undefined;
    title: String | undefined;
    institution : String | undefined;
    certificationId: String | undefined;
    yearEarned: number = 2020;
    yearExpires: number = 2025;
    monthEarned: String = "";
    monthExpires: String = "";
}

export class Education {
    id: number | undefined;
    institution: String | undefined;
    degree : String | undefined;
    startYear: number = 2012;
    endYear: number = 2016;
    startMonth: String = "";
    endMonth: String = "";
    majors: String[] = [];
    minors: String[] = [];

    gpa: number = 2.0;
}

export class Experience {
    id: number[] = [];
    type: String = "";
    institution: String | undefined;
    secondaryInstitution: String | undefined;

    institutionStr: String = "";
    basicDescription: String = "";
    complexDescription: String[] = [];

    startYear: number = 2012;
    endYear: number = 2016;
    startMonth: String = "";
    endMonth: String = "";

    idCount: number = 0;
    subExperience: Experience[] = [];
}
export class PubContributor {
    contributor: String = "";
    contributionType: String = "";

    constructor(contributor: String, contributionType: String){
        this.contributionType = contributionType;
        this.contributor = contributor;
    }
}

export class Publication {
    id: number = 0;
    title: String = "";
    publisher: String= "";
    publicationYear: number = 2018;
    publicationMonth: String = "";

    contributors: PubContributor[] = [];
    url: String | undefined;

    description: String = "";
}

export const MONTH_LIST: String[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]
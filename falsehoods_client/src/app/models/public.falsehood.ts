import { Institution } from "./institution";
import { PublicFigure } from "./public.figure";
import { Record } from "./records";
import { Region } from "./region";



export class PublicFalsehood {
    id: number;
    official: PublicFigure;
    status: number;
    officialType: number;
    severity: number;
    region: Region;
    institution: Institution;
    dateMade: Date;
    userId: String;
    tags: String;

    constructor(id: number,
        official: PublicFigure,
        status: number,
        officialType: number,
        severity: number,
        region: Region,
        institution: Institution,
        dateMade: Date,
        userId: String,
        tags: String){
            this.id = id;
            this.official = official;
            this.status = status;
            this.officialType = officialType;
            this.severity = severity;
            this.region = region;
            this.institution = institution;
            this.dateMade = dateMade;
            this.userId = userId;
            this.tags = tags;
    }
}

export class PublicFalsehoodRecords {
    falsehoodId: number;
    records: Record[];

    constructor(falsehoodId: number,
        records: Record[]) {
            this.falsehoodId = falsehoodId;
            this.records = records;
    }
}

export class FullPublicFalsehood {
    contents: string;
    metadata: PublicFalsehood;
    records: PublicFalsehoodRecords;

    constructor(contents: string,
        metadata: PublicFalsehood,
        records: PublicFalsehoodRecords) {
            this.contents = contents;
            this.metadata = metadata;
            this.records = records;
    }
}

export class PublicFalsehoodSearch {
    terms: string | undefined;
    to: Date | undefined;
    from: Date | undefined;
    numberOfEntries: number = 20;
    page: number = 0;
    official: PublicFigure | undefined;
    minimum: Number | undefined;
    maximum: Number | undefined;
}
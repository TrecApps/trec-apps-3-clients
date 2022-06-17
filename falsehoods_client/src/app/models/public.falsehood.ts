import { Institution } from "./institution";
import { PublicFigure } from "./public.figure";
import { Record } from "./records";
import { Region } from "./region";
import { Severity } from "./Severity";

export class SearchPublicFalsehood {
    terms: String = "";
    
    to: Date | undefined;
    from: Date | undefined;
    region: Region | undefined;
    institution: Institution | undefined;
    minimum: Severity | undefined;
    maximum: Severity | undefined;

    official: PublicFigure | undefined;
    numberOfEntries:number | undefined;
    page: number | undefined;
}

export class PublicFalsehood {
    id: number | undefined;
    official: PublicFigure | undefined;
    status: number | undefined;
    officialType: number;
    severity: number;
    region: Region | undefined;
    institution: Institution | undefined;
    dateMade: Date | undefined;
    userId: String;
    tags: String;

    constructor(){
            this.id = -1;
            this.official = undefined;
            this.status = undefined;
            this.officialType = -1;
            this.severity = 1;
            this.region = undefined;
            this.institution = undefined;
            this.dateMade = undefined;
            this.userId = "";
            this.tags = "";
    }
}

export class PublicFalsehoodRecords {
    falsehoodId: number;
    records: Record[];

    constructor() {
            this.falsehoodId = -1;
            this.records = [];
    }
}

export class FullPublicFalsehood {
    contents: string;
    metadata: PublicFalsehood;
    records: PublicFalsehoodRecords;

    constructor() {
            this.contents = "";
            this.metadata = new PublicFalsehood();
            this.records = new PublicFalsehoodRecords();
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
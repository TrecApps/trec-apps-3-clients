

export class Record {
    recordType: string;
    details: string;
    made: Date;
    userId: number;
    specifics: string;

    constructor(recordType: string,
        details: string,
        made: Date,
        userId: number,
        specifics: string) {
            this.recordType = recordType;
            this.made = made;
            this.details = details;
            this.specifics = specifics;
            this.userId = userId;
    }
}
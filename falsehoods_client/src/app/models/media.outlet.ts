import { Record } from "./records";


export class MediaOutlet {
    constructor(outletId: number,foundationYear:number, name: string) {
        this.foundationYear = foundationYear;
        this.name = name;
        this.outletId = outletId;
    }
    outletId: number;
    foundationYear:number;
    name: string;
};

export class MediaOutletRecords {
    outletId: number;
    partition = 0;
    records: Record[];

    constructor(outletId: number, records: Record[]) {
        this.outletId = outletId;
        this.records = records;
    }
}

export class MediaOutletEntry {
    outlet: MediaOutlet;
    text: String;
    records: Record[];

    constructor(outlet: MediaOutlet, text:string, records: Record[]) {
        this.outlet = outlet;
        this.text = text;
        this.records = records;
    }
}
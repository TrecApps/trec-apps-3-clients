import { Record } from "./records";


export class Institution {
    constructor() {
        this.name = "";
        this.id = -1;
    }
    id: number;
    name: string;
};

export class InstitutionRecords {
    figureId: number;
    partition = 0;
    records: Record[];

    constructor(figureId: number, records: Record[]) {
        this.figureId = figureId;
        this.records = records;
    }
}

export class InstitutionEntry {
    institution: Institution;
    contents: String;
    records: Record[];

    constructor() {
        this.institution = new Institution();
        this.contents = "";
        this.records = [];
    }
}
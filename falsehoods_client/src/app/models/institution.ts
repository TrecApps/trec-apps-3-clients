import { Record } from "./records";


export class Institution {
    constructor(id: number,
        name:string) {
        this.name = name;
        this.id = id;
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

    constructor(institution: Institution, contents:string, records: Record[]) {
        this.institution = institution;
        this.contents = contents;
        this.records = records;
    }
}
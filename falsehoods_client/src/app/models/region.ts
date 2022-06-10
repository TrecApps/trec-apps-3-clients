import { Record } from "./records";


export class Region {
    constructor() {
        this.name = "";
        this.id = -1;
    }
    id: number;
    name: string;
};

export class RegionRecords {
    figureId: number;
    partition = 0;
    records: Record[];

    constructor(figureId: number, records: Record[]) {
        this.figureId = figureId;
        this.records = records;
    }
}

export class RegionEntry {
    region: Region;
    contents: String;
    records: Record[];

    constructor() {
        this.region = new Region();
        this.contents = "";
        this.records = [];
    }
}
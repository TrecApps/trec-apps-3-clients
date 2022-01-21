import { Record } from "./records";


export class Region {
    constructor(id: number,
        name:string) {
        this.name = name;
        this.id = id;
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

    constructor(region: Region, contents:string, records: Record[]) {
        this.region = region;
        this.contents = contents;
        this.records = records;
    }
}
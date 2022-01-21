import { Record } from "./records";


export class PublicFigure {
    constructor(outletId: number,
        firstname:string,
        middleNames:string,
        lastName:string,
        name: string) {
        this.firstname = firstname;
        this.lastName = lastName;
        this.middleNames = middleNames;
        this.name = name;
        this.id = outletId;
    }
    id: number;
    firstname:string;
    middleNames:string;
    lastName:string;
    name: string;
};

export class PublicFigureRecords {
    figureId: number;
    partition = 0;
    records: Record[];

    constructor(figureId: number, records: Record[]) {
        this.figureId = figureId;
        this.records = records;
    }
}

export class PublicFigureEntry {
    figure: PublicFigure;
    text: String;
    records: Record[];

    constructor(figure: PublicFigure, text:string, records: Record[]) {
        this.figure = figure;
        this.text = text;
        this.records = records;
    }
}
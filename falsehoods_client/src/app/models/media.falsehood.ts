import { MediaOutlet } from "./media.outlet";
import { PublicFigure } from "./public.figure";
import { Record } from "./records";



export class MediaFalsehood {
    id: number;
    outlet: MediaOutlet;
    status: number;
    mediaType: number;
    severity: number;
    author1: PublicFigure;
    author2: PublicFigure;
    source: String;
    dateMade: Date;
    contentId: String;
    userId: String;
    tags: String;

    constructor(id: number,
        outlet: MediaOutlet,
        status: number,
        mediaType: number,
        severity: number,
        author1: PublicFigure,
        author2: PublicFigure,
        source: String,
        dateMade: Date,
        contentId: String,
        userId: String,
        tags: String){
            this.id = id;
            this.outlet = outlet;
            this.status = status;
            this.mediaType = mediaType;
            this.severity = severity;
            this.author1 = author1;
            this.author2 = author2;
            this.source = source;
            this.dateMade = dateMade;
            this.contentId = contentId;
            this.userId = userId;
            this.tags = tags;
    }
}

export class MediaFalsehoodRecords {
    falsehoodId: number;
    records: Record[];

    constructor(falsehoodId: number,
        records: Record[]) {
            this.falsehoodId = falsehoodId;
            this.records = records;
    }
}

export class FullMediaFalsehood {
    contents: string;
    metadata: MediaFalsehood;
    records: MediaFalsehoodRecords;

    constructor(contents: string,
        metadata: MediaFalsehood,
        records: MediaFalsehoodRecords) {
            this.contents = contents;
            this.metadata = metadata;
            this.records = records;
    }
}

export class MediaFalsehoodSearch {
    terms: string | undefined;
    to: Date | undefined;
    from: Date | undefined;
    outlet: MediaOutlet | undefined;
    numberOfEntries: number = 20;
    page: number = 0;
    author: PublicFigure | undefined;
    minimum: Number | undefined;
    maximum: Number | undefined;

   
}
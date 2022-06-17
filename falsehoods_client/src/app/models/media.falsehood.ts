import { MediaOutlet } from "./media.outlet";
import { PublicFigure } from "./public.figure";
import { Record } from "./records";



export class MediaFalsehood {
    id: number | undefined;
    outlet: MediaOutlet | undefined;
    status: number | undefined;
    mediaType: number | undefined;
    severity: number | undefined;
    author1: PublicFigure | undefined;
    author2: PublicFigure | undefined;
    source: String | undefined;
    dateMade: Date | undefined;
    contentId: String | undefined;
    userId: String | undefined;
    tags: String;

    constructor(){
        this.tags = "";
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
    records: MediaFalsehoodRecords | undefined;

    constructor(contents: string,
        metadata: MediaFalsehood,
        records: MediaFalsehoodRecords | undefined) {
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
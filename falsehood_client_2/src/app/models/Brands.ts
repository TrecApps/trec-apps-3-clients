export class ResourceMetaData{
    profileBase64: string | undefined;
    profileDesc: string | undefined;

    metadata: Object;

    constructor(){
        this.metadata = new Object();
    }
}

export class BrandInfoEntry {
    name: string | undefined;
    contents: string | undefined;
    type: string | undefined;
    metaData: ResourceMetaData | undefined;
}

export class BrandInfo {
    id:string | undefined;
    name: string | undefined;
    defaultLanguage: string | undefined;
    reviewStage: string | undefined;
    brandId: string|undefined;
    resourceType: string | undefined;
}

export class BrandInfoContainer {
    brandInfo: BrandInfo | undefined;
    contents: string | undefined;
    metadata: ResourceMetaData | undefined;
}

export class Record{
    app: string;
    keyword: string;
    userId: string;
    brandId: string;
    comment: string;
    id: string;
    made: Date;
}
export class ResourceMetaData{
    profileBase64: string | undefined;
    profileDesc: string | undefined;

    metadata: Object;
}

export class BrandInfoEntry {
    name: string;
    contents: string;
    type: string;
    metaData: ResourceMetaData | undefined;
}

export class BrandReviewEntry {
    approve: boolean;
    comment: string | undefined;
    id: string;
}

export class BrandInfo {
    id:string | undefined;
    name: string | undefined;
    defaultLanguage: string | undefined;
    reviewStage: string | undefined;
    brandId: string|undefined;
}

export class BrandInfoContainer {
    brandInfo: BrandInfo | undefined;
    contents: string | undefined;
    metadata: ResourceMetaData | undefined;
}
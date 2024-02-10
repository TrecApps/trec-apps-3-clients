export class ImageEntry {
    id: String | undefined;

    name: String | undefined;

    type: String | undefined;

    owner: String | undefined;

    tags: String | undefined;

    uploaded: Date | undefined;

    imageData: String | undefined;
}

export class ImageDetails{
    isAdultContent:boolean = false;
    isRacyContent:boolean = false;
    isGoryContent:boolean = false;
    adultScore:number =0.0;
    racyScore:number =0.0;
    goreScore:number = 0.0;
}

export class ImageMeta {
    type: String = "";            // Format of the image

    app: String = "";             // The App that uploaded this

    isPublic: boolean = false;       // Can anyone access it?

    extraDetails: ImageDetails | undefined;
}

export class ImageMetaRes {
    status: number = 200;
    message: String = "";
    meta: ImageMeta | undefined;
}
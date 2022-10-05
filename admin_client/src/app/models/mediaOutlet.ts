export class MediaOutlet
{
    approved: number | undefined;
    outletId: Number | undefined;
    foundationYear: Number | undefined;
    name: String | undefined;
}

export class MediaOutletEntry {
	outlet:MediaOutlet = new MediaOutlet();
    text:string | undefined;
}
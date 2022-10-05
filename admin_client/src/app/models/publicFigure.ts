export class PublicFigure{
    id: Number | undefined;
    firstname: string | undefined;
    middleNames: string | undefined;
    lastName: string | undefined;
    approved: number | undefined;
};

export class PublicFigureEntry {
	figure: PublicFigure | undefined;
    text: string | undefined;   
}
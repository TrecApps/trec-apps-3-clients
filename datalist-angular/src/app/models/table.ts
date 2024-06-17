
export class Field{
    type:string | undefined;
    min: number | undefined;
    max: number | undefined;
    fMin: number | undefined;
    fMax: number | undefined;
    nullable: boolean = true;
    enumVals: string[] | null = null;
    enumCaseSensitive: boolean = true;
}

export class TableTemplate {
    id: string | undefined;
    name: string = "";
    description: string | undefined;
    user: string | undefined;
    fields: Map<string, Field> = new Map<string, Field>();
}

export class Table {
    id: string | undefined;
    tableTemplateId: string | undefined;
    name: string = "";
    user: string | undefined;
    description: string | undefined;
    rows: Object[] = [];
}
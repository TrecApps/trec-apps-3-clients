import { BrandInfo, Record } from "./Brands";

export class ReviewEntry{
    comment: string;
    falsehood: string;
}

export class Factcheck{
    id: string;
    title: string;
    reviewStage: string;
}

export class FactcheckUpdate{
    content: string;
    factCheck: Factcheck;
    comment: string;
}

export class FactcheckSubmission {
    title: string;
    content: string;
    tags: string[];
}

export class Falsehood{
    id: string;
    dateMade: Date;
    factCheck: Factcheck | undefined;
    figure: BrandInfo;
    outlet: BrandInfo;
    institution: BrandInfo;
    region: BrandInfo;
    reviewStage: string;
    severity: string;
}

export class FalsehoodSubmission {
    content: string;
    tags: string[];
    falsehood: Falsehood;
    readyForReview = true;
}

export class ContentUpdate{
    id:string;
    content:string;
    comment:string;
}

export class FactCheckList{
    totalCount:number;
    results: Factcheck[];
}

export class FactCheckRet{
    factCheck: Factcheck;
    content: string;
}

export class FalsehoodList{
    totalCount:number;
    results: Falsehood[];
}

export class FalsehoodRet {
    falsehood: Falsehood;
    contents: string;
    records: Record[];
    tags: string[];
}
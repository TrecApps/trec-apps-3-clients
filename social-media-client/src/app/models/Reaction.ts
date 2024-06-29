

export class Reaction {
    id: number | undefined;
    positive: boolean = true;           // Does the reaction support the comment/commenter
    type: String = "";                // THe type of reaction (like, sad, angry, etc)
    isPrivate: boolean = false;  // Should the app reveal the ID of the reactor?
    userId: String = "";              // the TrecAccount of the person who reacted
    brandId: String | undefined;
}

export class ReactionPost{
    
    positive: boolean;
    type: string;
    isPrivate: boolean = false;
    contentId: string;
    id: number | undefined;

    constructor(positive: boolean, type: string, contentId: string){
        this.positive = positive;
        this.contentId = contentId;
        this.type = type;
    }
}

export class ReactionComment{
    
    positive: boolean;
    type: string;
    isPrivate: boolean = false;
    contentId: string;
    id: number | undefined;

    constructor(positive: boolean, type: string, contentId: string){
        this.positive = positive;
        this.contentId = contentId;
        this.type = type;
    }
}
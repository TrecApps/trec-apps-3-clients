

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
    postId: string;
    id: number | undefined;

    constructor(positive: boolean, type: string, postId: string){
        this.positive = positive;
        this.postId = postId;
        this.type = type;
    }
}

export class ReactionComment{
    
    positive: boolean;
    type: string;
    isPrivate: boolean = false;
    commentId: string;
    id: number | undefined;

    constructor(positive: boolean, type: string, commentId: string){
        this.positive = positive;
        this.commentId = commentId;
        this.type = type;
    }
}
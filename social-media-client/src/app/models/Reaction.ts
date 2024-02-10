

export class Reaction {
    id: number | undefined;
    positive: boolean = true;           // Does the reaction support the comment/commenter
    type: String = "";                // THe type of reaction (like, sad, angry, etc)
    isPrivate: boolean = false;  // Should the app reveal the ID of the reactor?
    userId: String = "";              // the TrecAccount of the person who reacted
    brandId: String | undefined;
}
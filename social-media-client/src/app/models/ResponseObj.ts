export interface RObjectMap {
    [key: string]: number;
}

export class ReactionStats {
    reactions: RObjectMap;
    yourReaction: string | undefined;
    id: number | undefined;

    constructor(reactions: RObjectMap, yourReaction: string | undefined, id: number | undefined){
        this.reactions = reactions;
        this.yourReaction = yourReaction;
        this.id = id;
    }
}

export class ResponseObj {
    status: number = 200;
    message: String = "";

    id: String| undefined;
    data: String | undefined;
    reactions: RObjectMap | undefined;
    reactStats: ReactionStats | undefined;
}
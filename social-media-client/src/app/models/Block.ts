import { environment } from "../environments/environment";

export class BlockRequest {
    blockee: string;        // id of individual being blocked (Note: done at the Trec Account Level)
    appSpecific: boolean;    // USe for adding a block
    app: string = environment.app_name;             // Use for removing block

    constructor(blockee: string, appSpecific: boolean){
        this.blockee = blockee;
        this.appSpecific = appSpecific;
    }
}

export class Block {
    id: string;
    blocker: string;
    blockee: string;
    app: string;

    constructor(id: string, blocker: string, blockee: string,app: string){
        this.app = app;
        this.blockee = blockee;
        this.blocker = blocker;
        this.id = id;
    }
}
export enum ConnectionType {
    REQUESTED,
    CONFIRMED,
    ONE_WAY,
    NOT_SET
}

export enum ConnectionRequestTarget {
    FOLLOWERS,
    FOLLOWEES,
    REQUESTERS,
    REQUESTEES,
    CONFIRMED
}

export function connectionRequestTargetToStr(crt: ConnectionRequestTarget): string {
    switch(crt){
        case ConnectionRequestTarget.CONFIRMED: return "CONFIRMED";
        case ConnectionRequestTarget.FOLLOWEES: return "FOLLOWEES";
        case ConnectionRequestTarget.FOLLOWERS: return "FOLLOWERS";
        case ConnectionRequestTarget.REQUESTEES: return "REQUESTEES";
        case ConnectionRequestTarget.REQUESTERS: return "REQUESTERS";
    }
}

export class ConnectionEntry {
    id: number = 0;
    requester: string = "";
    requestee: string = "";
    type: ConnectionType | string = ConnectionType.NOT_SET;
    firstMade: Date | undefined;
    responded: Date | undefined;

    otherDisplayName: string = "";
}

export class ConnectionStatus {

    profileId: string;

    displayName: string;
    statusToViewer: string;
    id: number;


    constructor(profileId: string, displayName: string, statusToViewer: string, id: number){
        this.displayName = displayName;
        this.profileId = profileId;
        this.statusToViewer = statusToViewer;
        this.id = id;
    }
}
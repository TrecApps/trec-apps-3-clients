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

export class ConnectionEntry {
    id: number = 0;
    requester: string = "";
    requestee: string = "";
    type: ConnectionType = ConnectionType.NOT_SET;
    firstMade: Date | undefined;
    responded: Date | undefined;
}

export enum NotificationStatus {
    UNSEEN,
    UNREAD,
    READ

}

export enum ImageEndpointType {
    REGULAR,
    USER_PROFILE,
    BRAND_PROFILE
}

export class NotifyPost {
    type: ImageEndpointType | undefined;
    imageId: string | undefined;
    message: string;
    time: Date | undefined;
    category: string;
    relevantId: string | undefined;
    appSpecific: boolean = true;

    constructor(
        type: ImageEndpointType | undefined,
        imageId: string | undefined,
        message: string,
        time: Date | undefined,
        category: string,
        relevantId: string | undefined,
        appSpecific: boolean
    ) {
        this.appSpecific = appSpecific;
        this.category = category;
        this.imageId = imageId;
        this.message = message;
        this.relevantId = relevantId;
        this.time = time;
        this.type = type;
    }
}

export class Notification {
    status: NotificationStatus;
    notificationId: string;
    app: string;
    post: NotifyPost;

    constructor(
        status: NotificationStatus,
        notificationId: string,
        app: string,
        post: NotifyPost
    ){
        this.app = app;
        this.notificationId = notificationId;
        this.post = post;
        this.status = status
    }
}
export class PostConversation {
    app: string | undefined;
    profiles: string[] = [];
}

export class ProfileEntry {
    profileId: string;
    displayName: string;

    constructor(profileId: string, displayName: string = ""){
        this.displayName = displayName;
        this.profileId = profileId;
    }
}

export class ConversationEntry {
    id: string = "";
    participants: ProfileEntry[] = [];
    pages: number = 0;
    started: Date | undefined;
    apps: string = "";

    creator: string = "";
    lastSpeaker: string = "";
    lastMessage: string = "";
    pageSize: number = 0;
}


export class Message {

    contents: string[] = [];
    profile: string = "";
    timeMade: Date | undefined;
    lastEdited: Date | undefined;
    isReply: boolean = false; // Early drafts of our messaging system will keep it as false
    replyPointer: string | undefined;
    unreadBy: string[] = [];

    encrypted: boolean = false;
    page: number = 0;
    messageLocation: number = 0;

}

export class NewMessage {
    message: string;
    conversation: string;
    encrypt: boolean;

    constructor(message: string, conversation: string, encrypt: boolean = false){
        this.conversation = conversation;
        this.encrypt = encrypt;
        this.message = message;
    }
}

export class EditMessage {
    message: string;
    conversation: string;
    encrypt: boolean;

    page: number;
    messageEntry: number;

    constructor(message: string, conversation: string, page: number, messageEntry: number, encrypt: boolean = false){
        this.conversation = conversation;
        this.encrypt = encrypt;
        this.message = message;
        this.messageEntry = messageEntry;
        this.page = page;
    }
}
export class MessageId {
    page: number;
    pageLocation: number;
    isDeleted: boolean;

    constructor(page: number, pageLocation: number, isDeleted: boolean = false){
        this.isDeleted = isDeleted;
        this.page = page;
        this.pageLocation = pageLocation;
    }
}

export class UpdateResponse {
    pageSize: number;

    newPages: number;
    newMessages: number;

    latest: MessageId;
    editedMessages: MessageId[];

    constructor(pageSize: number,newPages: number,newMessages: number,latest: MessageId,editedMessages: MessageId[]){
        this.editedMessages = editedMessages;
        this.latest = latest;
        this.newMessages = newMessages;
        this.newPages = newPages;
        this.pageSize = pageSize;
    }

}

export class LatestMessageList{
    messages: Message[] = [];
    latestPage: number = 0;
}
export class PropertyTreeNode {
    type: string = "";
    subNodes: Map<string, PropertyTreeNode> = new Map<string, PropertyTreeNode>();
}

export class ProfileCreateBody {
    displayName: String = "";
    pronouns: String | undefined;
    aboutMe: String | undefined;
    coverImage: String | undefined;
}

export class Detail {
    detail: String = "";
    type: String = "";    // Type of Detail

    details: Map<String, Detail> = new Map<String, Detail>();
}

export class Profile {
    aboutMe: String | undefined;
    displayName: String = "";

    preferredTheme: String | undefined;

    pronouns: String | undefined;

    coverImage: String | undefined;

    details: Map<String, Detail> = new Map<String, Detail>();
}    
import { BrandInfo } from "./BrandInfo";
import { Certifications, Education, Experience, Publication } from "./ProfileDetails";

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

    certId: number = 0;
    certifications : Certifications[] = [];

    eduId: number = 0;
    educations  : Education[] = [];

    expId: number = 0;
    experiences  : Experience[] = [];

    pubId: number = 0;
    publications  : Publication[] = [];


    favoriteMovies : BrandInfo[] = [];

    favoriteAnimals : BrandInfo[] = [];
    favoritePlants : BrandInfo[] = [];
    favoriteSongs : BrandInfo[] = [];
    favoriteBooks : BrandInfo[] = [];
    favoriteShows : BrandInfo[] = [];
    favoriteRestaurants : BrandInfo[] = [];
    favoriteVideoGames : BrandInfo[] = [];
    favoriteGames : BrandInfo[] = [];
}

export function getProfileSkaffold(): Profile {
    let ret = new Profile();

    ret.aboutMe = "I created this website";
    ret.displayName = "John Jacko";
    ret.pronouns = "(he/him)";
    
    return ret;
}

export class ProfileSel {
    id: string = "";
    name: string = "";

    shortAboutMe: string | undefined;
    homeContentPages: number = 0;
}

export enum SocialMediaEventType {
    POST,
    COMMENT,
    POST_REACTION,
    COMMENT_REACTION
}

export class SocialMediaEvent {
    resourceId: string = "";
    type: SocialMediaEventType = SocialMediaEventType.POST;
    module: string = "";
    profile: string = "";
    reaction: string = "";
    category: string = "";
    postId: string = "";
}

export class SocialMediaEventList {
    page: number;

    lateBounds: number;
    earlyBounds: number;

    events: SocialMediaEvent[];

    constructor(page: number, lateBounds: number, earlyBounds: number, events: SocialMediaEvent[]){
        this.earlyBounds = earlyBounds;
        this.events = events;
        this.lateBounds = lateBounds;
        this.page = page;
    }
}
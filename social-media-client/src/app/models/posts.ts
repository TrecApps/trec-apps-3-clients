import { Reaction } from "./Reaction";

export class AddPost{
    content: String ="";
    moduleId: String | undefined;
    tags: String | undefined;
    id: String | undefined;
    category: String | undefined;
}


export class CommentList{
    show: boolean = true;
    comments: Comment[] = [];
}


export class Comment {
    commentId: String;               // The id of the Comment
    level: number;                     // the level of the comment
    userId: String;                  // The user who commented
    brandId: String | undefined;                 // If they used a Brand Account
    displayName: String | undefined;
    contents: string[] = [];
    made: Date | undefined;
    returnReaction: Reaction | undefined;

    replies: CommentList[] = [];

    constructor(commentId: String, level: number, userId: String){
        this.commentId = commentId;
        this.userId = userId;
        this.level = level;
    }
}

export class Post {
    postId: String;
    userId: String;
    brandId: String | undefined;
    tags: String | undefined;
    contents: string[] = [];
    displayName: String = "";
    made: Date | undefined;

    comments: CommentList[] = [];

    returnReaction: Reaction | undefined;
    category: String | undefined;

    constructor(postId: String, userId: String){
        this.postId = postId;
        this.userId = userId;
    }
}


export class CommentPost {
    comment: String;
    parent: String;
    level: number;

    constructor(comment: String, parent: String, level: number){
        this.comment = comment;
        this.parent = parent;
        this.level = level;
    }
}


export const posts1: Post[] = [
    {
        postId: "ae1",
        userId: "1",
        brandId: undefined,
        tags: undefined,
        contents: ["This is My First Post"],
        displayName: "John Jacko",
        made: undefined,
        returnReaction: {
            id: 1,
            positive: true,
            type: 'Like',
            isPrivate: false,
            userId: "1",
            brandId: undefined
        },
        category: undefined,
        comments: [
            {
                show: true,
                comments: [
                    {
                        commentId:"ce1",
                        brandId: undefined,
                        made: undefined,
                        userId: "2",
                        level: 0,
                        displayName: "Sylene",
                        returnReaction: undefined,
                        contents: ["Wow! First Comment"],
        
                        replies: [
                            {
                                show: true,
                                comments: [
                                    {
                                        commentId:"ce2",
                                        brandId: undefined,
                                        made: undefined,
                                        userId: "1",
                                        level: 1,
                                        displayName: "John Jacko",
                                        contents: ["First Reply"],
                                        returnReaction: undefined,
                                        replies: []
                                    }
                                ]
                            }
                            
                        ]
                    },
                    {
                        commentId:"ce3",
                        brandId: undefined,
                        made: undefined,
                        userId: "1",
                        level: 0,
                        displayName: "John Jacko",
                        returnReaction: undefined,
                        contents: ["MY First Comment"],
                        replies: []
                    }
                ]
            }
            
        ]
    },
    {
        postId: "ae2",
        userId: "1",
        brandId: undefined,
        made: undefined,
        tags: undefined,
        contents: ["Testing **italics** and __Bold__"],
        displayName: "John Jacko",
        returnReaction: undefined,
        category: undefined,
        comments:[]
    },
    {
        postId: "ae4",
        userId: "1",
        brandId: undefined,
        made: undefined,
        tags: undefined,
        contents: ["Testing **italics and __ Interlocking **Bold__"],
        displayName: "John Jacko",
        returnReaction: undefined,
        category: undefined,
        comments:[]
    }
];

export const posts2: Post[] = [
    {
        postId: "ae3",
        brandId: undefined,
        tags: undefined,
        made: undefined,
        userId: "2",
        contents: ["Testing **italics and __Bold Nested__**!"],
        displayName: "Sylene",
        returnReaction: undefined,
        category: undefined,
        comments: [
            {
                show: true,
                comments: [
                    {
                        commentId:"ce4",
                        brandId: undefined,
                        made: undefined,
                        userId: "1",
                        level: 0,
                        displayName: "John Jacko",
                        returnReaction: undefined,
                        contents: ["**Italics** and __Bold__ should work in comments too!"],
                        replies: []
                    }
                ]
            }
            
        ]
    }
]
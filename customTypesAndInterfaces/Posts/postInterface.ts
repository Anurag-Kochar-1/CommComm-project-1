
export interface IPost {
        postID: string
        postTitle: string | number
        postCaption: string | number | null
        postImageURL: string | null
        postVideoURL: string | null
        postCreatorID: string
        postCreatorName: string
        postCreateAtCommunityID: string
        upvotedByUserID: [],

        createdAt?:  any
}
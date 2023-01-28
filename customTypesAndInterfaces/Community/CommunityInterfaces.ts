

export interface ICommunityData {
        communityID : string
        communityName: string
        communityCategory: string
        communitySubCategory : string
        communityLogo : string  | null 
        communityBanner : string | null
        communityMembersID : string[]
        communityOwnerID: string
        communityOwnerDisplayName: string
        communityOwnerEmail:string
        communityPostsID: string[]
        communityDescription: string 
        isCommunitySuggested: boolean
        isCommunityTrending: boolean

        communityCoursesID: string[]
}
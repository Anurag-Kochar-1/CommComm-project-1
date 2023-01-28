
export interface ICourse {
    courseID: string
    communityID: string
    courseName: string
    courseGoal: string
    courseDurationInDays: number | string
    courseSourceOfLearning: string
    courseSourceOfLearningLink: string
    courseSourceOfLearningID: string
    coursePrerequisites: string
    courseDescription: string
    courseCreatorID: string

    youtubeCourseThumbnail: string
    youtubeCourseChannelName: string
    youtubeCourseChannelID: string
    youtubeCourseChannelLogo: string
    youtubeCourseTitle: string

    youtubeVideoID?: string
    youtubePlaylistID?: string

    isCommunityCourseTrending: boolean
    isCommunityCoursePopular: boolean
}
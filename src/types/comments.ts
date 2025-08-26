export interface Comment {
  id: string;
  petId: string;
  userId: string;
  commentText: string;
  likesCount?: number;
  likedBy?: string[];
}

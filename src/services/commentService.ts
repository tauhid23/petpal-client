import type { Comment } from "../types/comments";

const API_URL = "http://localhost:5000/api/comments";

// Create a comment
export const createComment = async (petId: string, userId: string, commentText: string): Promise<Comment> => {
  const res = await fetch(`${API_URL}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ petId, userId, commentText }),
  });
  if (!res.ok) throw new Error("Failed to create comment");
  return res.json();
};

// Get comments by petId
export const getCommentsByPet = async (petId: string): Promise<Comment[]> => {
  const res = await fetch(`${API_URL}/${petId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
};

// Like a comment
export const likeComment = async (commentId: string, userId: string): Promise<Comment> => {
  const res = await fetch(`${API_URL}/like/${commentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Failed to like comment");
  return res.json();
};

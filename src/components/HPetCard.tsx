import React, { useEffect, useState } from 'react';
import type { Pet } from '../types/pet';
import type { Comment } from '../types/comments';
import { getCommentsByPet, createComment, likeComment } from '../services/commentService';
import { FaHeart, FaComment, FaShareAlt } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Import motion

interface HPetCardProps {
  pet: Pet;
  userId: string; // logged in user id
}

const HPetCard: React.FC<HPetCardProps> = ({ pet, userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await getCommentsByPet(pet.id);
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment(pet.id, userId, newComment);
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await likeComment(commentId, userId);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  // Define the animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // Wrap the card in motion.div and apply the variants
    <motion.div
      className="max-w-sm mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transform transition duration-500 hover:scale-105"
      variants={cardVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <img
          className="w-full h-64 object-cover"
          src={pet.photos?.[0]}
          alt={pet.name}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h2 className="text-3xl font-bold text-white leading-tight">
            {pet.name}
          </h2>
          <p className="text-gray-300 font-semibold">{pet.breed}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-around items-center text-gray-500 mb-4 border-b pb-4">
          <button className="flex items-center space-x-2 transition-colors hover:text-red-500">
            <FaHeart className="text-xl" />
            <span className="font-semibold">Like</span>
          </button>
          <button
            className="flex items-center space-x-2 transition-colors hover:text-blue-500"
            onClick={handleToggleComments}
          >
            <FaComment className="text-xl" />
            <span className="font-semibold">Comment</span>
          </button>
          <button className="flex items-center space-x-2 transition-colors hover:text-green-500">
            <FaShareAlt className="text-xl" />
            <span className="font-semibold">Share</span>
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg text-gray-800">Comments</h3>
          {comments.length > 0 ? (
            <div className="space-y-3 pr-2">
              {comments.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="bg-gray-100 p-3 rounded-lg flex justify-between items-start"
                >
                  <p className="text-gray-700 leading-snug flex-1">
                    {c.commentText}
                  </p>
                  <button
                    className="flex items-center text-sm text-gray-500 ml-4 hover:text-blue-600 transition-colors"
                    onClick={() => handleLike(c.id)}
                  >
                    <FaHeart className="mr-1 text-red-500" />
                    {c.likesCount}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No comments yet. Be the first!</p>
          )}

          {comments.length > 3 && (
            <button
              onClick={handleToggleComments}
              className="w-full text-center text-blue-600 font-semibold mt-2 hover:underline"
            >
              {showAllComments ? 'Hide comments' : `View all ${comments.length} comments`}
            </button>
          )}

          {showAllComments && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <h4 className="font-bold text-gray-800">All Comments</h4>
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-100 p-3 rounded-lg flex justify-between items-start">
                  <p className="text-gray-700 leading-snug flex-1">{c.commentText}</p>
                  <button
                    className="flex items-center text-sm text-gray-500 ml-4 hover:text-blue-600 transition-colors"
                    onClick={() => handleLike(c.id)}
                  >
                    <FaHeart className="mr-1 text-red-500" />
                    {c.likesCount}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3 pt-4 border-t">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-full px-4 py-2 text-gray-700 transition"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Post
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HPetCard;
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquare, ThumbsUp } from 'lucide-react';

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  date: Date;
}

interface CommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: number) => void;
}

export function Comments({ comments, onAddComment, onLikeComment }: CommentsProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <MessageSquare className="mr-2" />
        Comentários ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicione um comentário..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Comentar
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h4 className="font-semibold">{comment.user.name}</h4>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(comment.date, { locale: ptBR, addSuffix: true })}
                </p>
              </div>
            </div>
            <p className="mt-2">{comment.content}</p>
            <button
              onClick={() => onLikeComment(comment.id)}
              className="mt-2 flex items-center text-gray-500 hover:text-blue-600"
            >
              <ThumbsUp className="mr-1" size={16} />
              <span>{comment.likes}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
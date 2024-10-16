// CommentItem.tsx
import React, { useState } from 'react';
import { fetchPosts, newPost } from '@/api/post-endpoint.service';
import ReplyList from './ReplyList';
import { UserModel } from '@/schema/user.model';

interface CommentItemProps {
  comment: Comment;
  user: UserModel;
}

export default function CommentItem({ comment, user }: CommentItemProps) {
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState<Reply[]>(comment.replies || []);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyPage, setReplyPage] = useState(1);

  const loadReplies = async (reset = false) => {
    if (loadingReplies || !hasMoreReplies) return;

    setLoadingReplies(true);

    try {
      const currentPage = reset ? 1 : replyPage;

      const response = await fetchPosts(currentPage, 5, undefined, comment._id);
      if (response && response.posts) {
        setReplies((prevReplies) =>
          reset ? response.posts : [...prevReplies, ...response.posts]
        );

        if (currentPage >= response.totalPages) {
          setHasMoreReplies(false);
        } else {
          setReplyPage(currentPage + 1);
        }
      } else {
        setHasMoreReplies(false);
      }
    } catch (error) {
      console.error('Erro ao carregar replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleAddReply = async () => {
    if (!replyText.trim()) return;

    try {
      const newReplyData = {
        author: user._id,
        parent_id: comment._id,
        content: replyText,
        pinned: false,
      };

      const response = await newPost(newReplyData);
      if (response) {
        setReplies((prevReplies) => [
          ...prevReplies,
          {
            _id: response._id,
            author: {
              _id: user._id,
              name: user.name,
              avatar_base64: user.avatar_base64,
            },
            content: replyText,
            created_at: new Date().toISOString(),
          },
        ]);
        setReplyText('');
        setShowReplyInput(false);
      }
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
    }
  };

  return (
    <div className="bg-primary-100 p-2 rounded-lg mb-2">
      <p className="text-sm font-bold text-highlight">{comment.author.name}</p>
      <p className="text-sm">{comment.content}</p>

      {/* Lista de Respostas */}
      {replies.length > 0 && <ReplyList replies={replies} />}

      {/* Botão para Carregar Mais Respostas */}
      {hasMoreReplies && (
        <button onClick={() => loadReplies()} className="text-sm text-highlight mt-1">
          {loadingReplies ? 'Carregando...' : 'Ver mais respostas'}
        </button>
      )}

      {/* Campo para Adicionar Nova Resposta */}
      {showReplyInput ? (
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="text"
            placeholder="Escreva uma resposta..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-primary-200 p-2 rounded-lg text-sm outline-none"
          />
          <button onClick={handleAddReply} className="text-highlight">
            Responder
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowReplyInput(true)}
          className="text-sm text-highlight mt-1"
        >
          Responder
        </button>
      )}
    </div>
  );
}

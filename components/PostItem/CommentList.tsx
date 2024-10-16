// CommentList.tsx
import React, { useState, useEffect } from 'react';
import { fetchPosts, newPost } from '@/api/post-endpoint.service';
import CommentItem from './CommentItem';
import { UserModel } from '@/schema/user.model';

interface CommentListProps {
  postId: string;
  user: UserModel; 
}

export default function CommentList({ postId, user }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    // Carregar os comentários iniciais
    loadComments(true);
  }, []);

  const loadComments = async (reset = false) => {
    if (loadingComments || !hasMoreComments) return;

    setLoadingComments(true);

    try {
      // Se for resetar, voltamos à página 1 e limpamos os comentários
      const currentPage = reset ? 1 : page;

      const response = await fetchPosts(currentPage, 5, undefined, postId);
      if (response && response.posts) {
        setComments((prev) =>
          reset ? response.posts : [...prev, ...response.posts]
        );

        // Verifica se ainda há mais páginas para carregar
        if (currentPage >= response.totalPages) {
          setHasMoreComments(false);
        } else {
          setPage(currentPage + 1);
        }
      } else {
        setHasMoreComments(false);
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const newCommentData = {
        author: user._id,
        parent_id: postId,
        content: commentText,
        pinned: false,
      };

      const response = await newPost(newCommentData);
      if (response) {
        setComments((prevComments) => [
          {
            _id: response._id,
            author: {
              _id: user._id,
              name: user.name,
              avatar_base64: user.avatar_base64,
            },
            content: commentText,
            created_at: new Date().toISOString(),
            replies: [],
            totalChildren: 0,
          },
          ...prevComments,
        ]);
        setCommentText('');
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  return (
    <div>
      {/* Lista de Comentários */}
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} user={user} />
      ))}

      {/* Botão para Carregar Mais Comentários */}
      {hasMoreComments && (
        <button onClick={() => loadComments()} className="text-sm text-highlight mt-2">
          {loadingComments ? 'Carregando...' : 'Ver mais'}
        </button>
      )}

      {/* Campo para Adicionar Novo Comentário */}
      <div className="flex items-center space-x-2 mt-4">
        <input
          type="text"
          placeholder="Escreva um comentário..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 bg-primary-100 p-2 rounded-lg text-sm outline-none"
        />
        <button onClick={handleAddComment} className="text-highlight">
          Comentar
        </button>
      </div>
    </div>
  );
}

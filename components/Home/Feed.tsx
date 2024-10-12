'use client';

import { fetchPosts } from '@/api/post-endpoint.service';
import React, { useEffect, useState } from 'react';
import { ThumbUp, Comment } from '@mui/icons-material';
import { Button, TextField, IconButton, InputAdornment, Snackbar, Alert } from "@mui/material";

interface Post {
  _id: string;
  user_id: { _id: string, name: string, avatar_url: string };
  content: string;
  media_urls: { url: string, type: 'image' | 'video' }[];
  created_at: string;
  likes: number;
  comments: { user: string, comment: string }[];
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async () => {
    if (loading) return;

    setLoading(true);
    const newPosts = await fetchPosts();
    if (newPosts && newPosts.length > 0) {
      const formattedPosts = newPosts.map(post => ({
        ...post,
        media_urls: post.media_urls.map(media => ({
          ...media,
          type: media.type as 'image' | 'video'
        }))
      }));
      setPosts((prevPosts) => [...prevPosts, ...formattedPosts]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2 && hasMore) {
        loadPosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}

      {loading && <div>Carregando...</div>}
      {!hasMore && <div>Não há mais posts</div>}
    </div>
  );
}

const PostItem = ({ post }: { post: Post }) => {
  const { user_id, content, media_urls, created_at, likes, comments } = post;

  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentList, setCommentList] = useState(comments);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = { user: "Usuário atual", comment: commentText };
      setCommentList([...commentList, newComment]);
      setCommentText('');
    }
  };

  return (
    <div className="bg-gray-100 text-black p-4 rounded-lg w-full max-w-xl shadow-md">
      <div className="flex items-center mb-4">
        <img
          src={user_id.avatar_url}
          alt={user_id.name}
          className="w-10 h-10 rounded-full mr-2"
        />
        <div>
          <h3 className="font-bold text-primary">{user_id.name}</h3>
          <p className="text-sm text-gray-400">{new Date(created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="mb-4">{content}</p>

      {media_urls.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {media_urls.map((media, idx) => (
            <div key={idx} className="w-full">
              {media.type === 'image' ? (
                <img src={media.url} alt="Post media" className="rounded-lg" />
              ) : (
                <video controls className="rounded-lg">
                  <source src={media.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1">
          <Button className="flex items-center space-x-1" onClick={handleLike}>
            <ThumbUp className={`text-lg ${liked ? 'text-primary' : 'text-gray-400'}`} />
            <span className={`${liked ? 'text-primary' : 'text-gray-400'}`}>
              {liked ? likes + 1 : likes}
            </span>
          </Button>
        </div>

        <div className="flex items-center space-x-1">
          <Comment className="text-primary" />
          <span className="text-primary">{commentList.length}</span>
        </div>
      </div>

      {commentList.length > 0 && (
        <div className="mb-4">
          {commentList.map((comment, index) => (
            <div key={index} className="bg-primary-100 p-2 rounded-lg mb-2">
              <p className="text-sm font-bold text-primary">{comment.user}</p>
              <p className="text-sm text-black">{comment.comment}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAddComment} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Escreva um comentário..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 bg-primary-100 p-2 rounded-lg text-sm text-black outline-none"
        />
        <Button type="submit" className="text-primary">Comentar</Button>
      </form>
    </div>
  );
};

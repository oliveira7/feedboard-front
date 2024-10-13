'use client';

import { fetchPosts } from '@/api/post-endpoint.service';
import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';  // Importa o PostItem

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
    const newPosts = await fetchPosts(page, 5);
    console.log(newPosts);
    if (newPosts && newPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
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

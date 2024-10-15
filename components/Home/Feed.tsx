'use client';

import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { fetchPosts } from '@/api/post-endpoint.service';
import PostItem from './PostItem';
import { PostModel } from '@/schema/posts.model';
import { useGroup } from '@/context/GroupContext';

const Feed = forwardRef((props, ref) => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { setAtualizarFeed, atualizarFeed, selectedGroup } = useGroup();

  const loadPosts = async (reset = false) => {
    if (loading) return;

    setLoading(true);

    if (reset) {
      setPosts([]);
      setPage(1); 
    }

    const response = await fetchPosts(reset ? 1 : page, limit, selectedGroup || null);
    if (response && response.length > 0) {
      setPosts((prevPosts) => [...(reset ? [] : prevPosts), ...response]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }

    setLoading(false);
    setInitialLoad(false);
  };

  const resetAndLoadPosts = async () => {
    setHasMore(true);  
    setInitialLoad(true);  
    await loadPosts(true);
  };

  const handleDelete = async () => {
    await loadPosts(true);   // Carrega novamente ao deletar um post
  };

  useEffect(() => {
    if (selectedGroup !== undefined) {
      resetAndLoadPosts();
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (atualizarFeed) {
      resetAndLoadPosts();
    }
  }, [atualizarFeed]);

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
      {initialLoad ? ( 
        <div>Carregando...</div>
      ) : (
        posts.map((post) => (
          <PostItem key={post._id} post={post} onDelete={handleDelete} />
        ))
      )}

      {loading && !initialLoad && <div>Carregando mais...</div>}
      {!hasMore && !initialLoad && <div>Não há mais posts</div>}
    </div>
  );
});

export default Feed;

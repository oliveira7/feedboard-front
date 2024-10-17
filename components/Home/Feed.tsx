'use client';

import React, { useEffect, useState, forwardRef } from 'react';
import { fetchPosts } from '@/api/post-endpoint.service';
import { PostModel } from '@/schema/posts.model';
import { useGroup } from '@/context/GroupContext';
import PostItem from '../PostItem/PosItem';

const Feed = forwardRef((props, ref) => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { setAtualizarFeed, atualizarFeed, selectedGroup } = useGroup();

  const loadPosts = async (reset = false) => {
    if (loading) return;

    setLoading(true);

    const currentLimit = reset ? 5 : limit;

    const { posts: fetchedPosts, totalPages } = await fetchPosts(1, currentLimit, selectedGroup || null);
    console.log(fetchedPosts);

    if (fetchedPosts && fetchedPosts.length > 0) {
      setPosts(fetchedPosts);

      setHasMore(currentLimit < totalPages * 5); 
    } else {
      setHasMore(false);
    }

    setLoading(false);
    setInitialLoad(false);
  };

  const resetAndLoadPosts = async () => {
    setHasMore(true);  
    setInitialLoad(true);  
    setLimit(5);
    setAtualizarFeed(false);
    await loadPosts(true);
  };

  const handleDelete = async () => {
    await loadPosts(true); 
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
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2 && hasMore && !loading) {
        setLimit((prevLimit) => prevLimit + 5); 
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

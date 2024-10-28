'use client';

import React, { useEffect, useState, forwardRef } from 'react';
import { fetchPosts } from '@/api/post-endpoint.service';
import { PostModel } from '@/schema/posts.model';
import { useGroup } from '@/context/GroupContext';
import { useSnackbar } from '@/context/SnackBarContext';
import PostItem from '../PostItem/PosItem';

interface FeedProps {
  idUserPage?: string;
}

const Feed = forwardRef<HTMLDivElement, FeedProps>(({ idUserPage }, ref) => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { setAtualizarFeed, atualizarFeed, selectedGroup } = useGroup();
  const { showError } = useSnackbar();

  const loadPosts = async (reset = false, customLimit: number | null = null) => {
    try {
      if (loading) return;
      setLoading(true);
      console.log(idUserPage);
      const currentLimit = reset ? 5 : customLimit || limit;
      const { posts: fetchedPosts, totalPages, total } = await fetchPosts(1, currentLimit, selectedGroup || undefined, undefined , undefined, idUserPage || undefined);
      console.log(fetchedPosts);

      if (fetchedPosts && fetchedPosts.length > 0) {
        setPosts(fetchedPosts);
        setHasMore(currentLimit < total);
      } else if (fetchedPosts && selectedGroup && fetchedPosts.length === 0) {
        setPosts([]);
        setHasMore(false);
      } else {
        setHasMore(false);
      }

      setLoading(false);
      setInitialLoad(false);
    } catch (e: unknown) {
      if (e instanceof Error) {
        showError(e.message);
      }      
      setLoading(false);
      setInitialLoad(false);
    }
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
    resetAndLoadPosts();
  }, [selectedGroup]);

  useEffect(() => {
    if (atualizarFeed) {
      resetAndLoadPosts();
    }
  }, [atualizarFeed]);

  useEffect(() => {
    const handleScroll = async () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2 && hasMore) {
        const newLimit = limit + 5;
        setLimit(newLimit);
        await loadPosts(false, newLimit);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, limit]);
  

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

Feed.displayName = 'Feed';

export default Feed;

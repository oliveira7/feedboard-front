import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { fetchPosts } from '@/api/post-endpoint.service';
import PostItem from './PostItem';
import { PostModel } from '@/schema/posts.model';

const Feed = forwardRef((props, ref) => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async () => {
    if (loading) return;

    setLoading(true);
    const response = await fetchPosts(page, 5);
    if (response && response.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...response]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }
    console.log(response);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useImperativeHandle(ref, () => ({
    loadPosts,
  }));

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
});

export default Feed;

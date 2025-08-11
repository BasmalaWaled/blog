'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiCalendar, FiUser, FiClock, FiArrowRight } from 'react-icons/fi';
import AuthGuard from '@/components/AuthGuard';

type Post = {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt?: string;
};

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('فشل تحميل المقالات');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('خطأ في تحميل المقالات:', error);
      setError('حدث خطأ أثناء تحميل المقالات');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setPosts(posts.filter(post => post.id !== id));
      } else {
        throw new Error('فشل حذف المقال');
      }
    } catch (error) {
      console.error('خطأ في حذف المقال:', error);
      setError('حدث خطأ أثناء حذف المقال');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.author?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Blogger</h1>
            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="/create" className="text-gray-700 hover:text-blue-600 font-medium">Create</a>
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Posts Section */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Posts</h2>
            
            <div className="space-y-6">

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                  <p>{error}</p>
                </div>
              )}

              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <p className="text-gray-500">No posts available</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm text-gray-500 flex items-center">
                              <FiUser className="mr-1" /> {post.author?.name || 'Unknown'}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <FiCalendar className="mr-1" /> 
                              {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <FiClock className="mr-1" /> 5 min read
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex justify-between items-center">
                            <a 
                              href={`/posts/${post.id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center group"
                            >
                              Read More
                              <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                            </a>
                            <button
                              onClick={() => deletePost(post.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                              title="Delete Post"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              <ul className="space-y-2">
                {['Technology', 'Design', 'Business', 'Lifestyle', 'Productivity'].map((category) => (
                  <li key={category}>
                    <a href="#" className="flex justify-between items-center text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50">
                      <span>{category}</span>
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                        {Math.floor(Math.random() * 20) + 1}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Posts</h3>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <a 
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-gray-200 rounded-lg w-16 h-16 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium text-gray-800 line-clamp-2">{post.title}</h4>
                      <span className="text-sm text-gray-500">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'JavaScript', 'TypeScript', 'Web Development', 'UI/UX', 'Design', 'Productivity'].map((tag) => (
                  <a 
                    key={tag}
                    href="#" 
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gray-800">Blogger</h2>
              <p className="text-gray-500 text-sm mt-1"> 2025 All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </AuthGuard>
  );
};

export default HomePage;

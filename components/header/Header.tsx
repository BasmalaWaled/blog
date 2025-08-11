import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './header.module.css';
import Navbar from './Navbar';

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // التحقق من وجود مستخدم مسجل دخول
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  if (loading) {
    return (
      <header className={styles.header}>
        <Navbar />
        <div className={styles.right}>
          <span>جاري التحميل...</span>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <Navbar />
      <div className={styles.right}>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              مرحباً، {user.name}
            </span>
            <button 
              onClick={handleLogout}
              className={`${styles.btn} bg-red-500 hover:bg-red-600 text-white`}
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <Link className={styles.btn} href="/login">
            تسجيل الدخول
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
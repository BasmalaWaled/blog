'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  name: string;
};

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ المستخدمين:", data); // log users
        setUsers(data);
      })
      .catch((err) => console.error("❌ خطأ في جلب المستخدمين:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      content,
      authorId : parseInt(authorId),
    };

    console.log("📤 البيانات المُرسلة للسيرفر:", payload); // Log payload before sending

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("✅ تم إنشاء البوست:", data);
        router.push('/');
      } else {
        const errorText = await res.text();
        console.error("❌ خطأ في إنشاء البوست:", errorText);
        alert('فشل في إنشاء البوست');
      }
    } catch (error) {
      console.error("❌ استثناء أثناء الإرسال:", error);
      alert('حدث خطأ غير متوقع');
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">✍️ إنشاء بوست جديد</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">العنوان</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">المحتوى</label>
          <textarea
            className="border p-2 w-full rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">الكاتب</label>
          <select
            className="border p-2 w-full rounded"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
          >
            <option value="">اختر كاتبًا</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center mb-6 py-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            إنشاء البوست
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreatePostPage;

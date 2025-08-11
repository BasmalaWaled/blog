import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

// ✅ GET: جلب جميع البوستات
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true }, 
    });

    return NextResponse.json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// ✅ POST: إنشاء بوست جديد
export async function POST(req: Request) {
  const body = await req.json();
  const { title, content, authorId } = body;

  console.log("📥 البيانات المستلمة:", body);

  
  if (!title || !content || !authorId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: parseInt(authorId), // تأكدنا من تحويله لرقم
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (err) {
    console.error("❌ Error creating post:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}







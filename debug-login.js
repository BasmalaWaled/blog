const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function debugLogin() {
  try {
    console.log('🔍 تحقق من اتصال قاعدة البيانات...');
    
    // تحقق من وجود المستخدمين
    const users = await prisma.user.findMany();
    console.log('👥 المستخدمون الموجودون:', users.length);
    
    if (users.length === 0) {
      console.log('❌ لا يوجد مستخدمون في قاعدة البيانات!');
      console.log('💡 تحتاج لتشغيل: npx prisma db seed');
      return;
    }
    
    // البحث عن مستخدم Basma
    const basmaUser = await prisma.user.findUnique({
      where: { email: 'basma@lawaled.com' }
    });
    
    if (!basmaUser) {
      console.log('❌ مستخدم Basma غير موجود!');
      console.log('📧 المستخدمون الموجودون:');
      users.forEach(user => {
        console.log(`   - ${user.name}: ${user.email}`);
      });
      return;
    }
    
    console.log('✅ مستخدم Basma موجود:', basmaUser.name);
    console.log('📧 البريد الإلكتروني:', basmaUser.email);
    
    // تحقق من كلمة المرور
    if (!basmaUser.password) {
      console.log('❌ كلمة المرور غير موجودة للمستخدم!');
      return;
    }
    
    console.log('🔐 كلمة المرور مشفرة موجودة');
    
    // اختبار مقارنة كلمة المرور
    const testPassword = '123456';
    const isPasswordValid = await bcrypt.compare(testPassword, basmaUser.password);
    
    if (isPasswordValid) {
      console.log('✅ كلمة المرور صحيحة!');
      console.log('🎉 نظام تسجيل الدخول يجب أن يعمل الآن');
    } else {
      console.log('❌ كلمة المرور غير صحيحة!');
      console.log('💡 تحتاج لإعادة تشغيل seed لتحديث كلمات المرور');
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاتصال:', error.message);
    
    if (error.message.includes('column') && error.message.includes('password')) {
      console.log('💡 يبدو أن حقل password غير موجود في قاعدة البيانات');
      console.log('🔧 تحتاج لتشغيل: npx prisma migrate dev');
    }
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateUsersWithoutPasswords() {
  try {
    console.log('🔍 البحث عن المستخدمين بدون كلمة مرور...');
    
    // البحث عن المستخدمين بدون كلمة مرور
    const usersWithoutPassword = await prisma.user.findMany({
      where: {
        password: null
      }
    });

    console.log(`📊 تم العثور على ${usersWithoutPassword.length} مستخدم بدون كلمة مرور`);

    if (usersWithoutPassword.length === 0) {
      console.log('✅ جميع المستخدمين لديهم كلمات مرور');
      return;
    }

    // تحديث كل مستخدم بكلمة مرور افتراضية
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    for (const user of usersWithoutPassword) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      
      console.log(`✅ تم تحديث كلمة مرور للمستخدم: ${user.email}`);
    }

    console.log('🎉 تم تحديث جميع المستخدمين بنجاح!');
    console.log(`🔑 كلمة المرور الافتراضية للجميع: ${defaultPassword}`);

  } catch (error) {
    console.error('❌ خطأ في تحديث المستخدمين:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUsersWithoutPasswords();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixUsers() {
  try {
    console.log('🔧 إصلاح المستخدمين الذين لا يملكون كلمات مرور...');
    
    // الحصول على كلمة مرور مشفرة افتراضية
    const defaultPassword = await bcrypt.hash('123456', 10);
    
    // البحث عن المستخدمين بدون كلمات مرور
    const usersWithoutPassword = await prisma.user.findMany({
      where: {
        password: null
      }
    });
    
    console.log(`📊 وجدت ${usersWithoutPassword.length} مستخدم بدون كلمة مرور`);
    
    if (usersWithoutPassword.length === 0) {
      console.log('✅ جميع المستخدمين لديهم كلمات مرور!');
      return;
    }
    
    // تحديث المستخدمين
    for (const user of usersWithoutPassword) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: defaultPassword }
      });
      console.log(`✅ تم تحديث المستخدم: ${user.name} (${user.email})`);
    }
    
    console.log('🎉 تم إصلاح جميع المستخدمين بنجاح!');
    console.log('🔑 كلمة المرور الافتراضية للجميع: 123456');
    
  } catch (error) {
    console.error('❌ خطأ في إصلاح المستخدمين:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUsers();

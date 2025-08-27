import { prisma } from '@/lib/prisma';

const InitPage = async () => {
  const specials = (process.env.SPECIAL_USERS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (specials.length > 0) {
    await prisma.user.updateMany({
      where: { email: { in: specials } },
      data: { role: 'SUPERADMIN' },
    });
  }

  return <div>✅ Init complete. Updated {specials.length} special users.</div>;
};

export default InitPage;

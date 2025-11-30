import WorkPage from '@/components/WorkPage';
import { prisma } from '@/lib/prisma';

export default async function Work() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { id: 'asc' }
  });

  return <WorkPage projects={projects} />;
}

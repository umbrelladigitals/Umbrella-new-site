import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import SelectedWork from '@/components/SelectedWork';
import NeuralInvite from '@/components/NeuralInvite';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    take: 4,
    orderBy: { id: 'asc' }
  });

  const services = await prisma.service.findMany();

  return (
    <>
      <Hero />
      <About />
      <Services services={services} />
      <NeuralInvite />
      <SelectedWork projects={projects} />
    </>
  );
}

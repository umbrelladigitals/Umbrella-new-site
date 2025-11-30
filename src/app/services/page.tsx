import ServicesPage from '@/components/ServicesPage';
import { prisma } from '@/lib/prisma';
import { ServicesClientWrapper } from './ServicesClientWrapper';

export default async function Services() {
  const services = await prisma.service.findMany();
  return <ServicesClientWrapper services={services} />;
}

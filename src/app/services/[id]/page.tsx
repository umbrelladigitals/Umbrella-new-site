import { prisma } from '@/lib/prisma';
import { ServiceDetailClientWrapper } from './ServiceDetailClientWrapper';

export default async function ServiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const services = await prisma.service.findMany();

  return <ServiceDetailClientWrapper id={id} services={services} />;
}

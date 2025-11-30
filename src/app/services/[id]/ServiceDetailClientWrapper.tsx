'use client';

import ServicesPage from '@/components/ServicesPage';
import { useRouter } from 'next/navigation';
import { Service } from '@prisma/client';

interface ServiceDetailClientWrapperProps {
  id: string;
  services: Service[];
}

export function ServiceDetailClientWrapper({ id, services }: ServiceDetailClientWrapperProps) {
  const router = useRouter();

  const handleServiceSelect = (newId: string | null) => {
    if (newId) {
      router.push(`/services/${newId}`);
    } else {
      router.push('/services');
    }
  };

  return <ServicesPage externalServiceId={id} onServiceSelect={handleServiceSelect} services={services} />;
}

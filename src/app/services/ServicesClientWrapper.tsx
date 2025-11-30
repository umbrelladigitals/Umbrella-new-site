'use client';

import ServicesPage from '@/components/ServicesPage';
import { useRouter } from 'next/navigation';
import { Service } from '@prisma/client';

interface ServicesClientWrapperProps {
  services: Service[];
}

export function ServicesClientWrapper({ services }: ServicesClientWrapperProps) {
  const router = useRouter();

  const handleServiceSelect = (id: string | null) => {
    if (id) {
      router.push(`/services/${id}`);
    }
  };

  return <ServicesPage externalServiceId={null} onServiceSelect={handleServiceSelect} services={services} />;
}

'use client';
import LegalPage from '@/components/LegalPage';
import { useRouter } from 'next/navigation';

export default function Privacy() {
  const router = useRouter();
  return <LegalPage type="privacy" onBack={() => router.push('/')} />;
}

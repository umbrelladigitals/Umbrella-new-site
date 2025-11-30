'use client';
import LegalPage from '@/components/LegalPage';
import { useRouter } from 'next/navigation';

export default function Terms() {
  const router = useRouter();
  return <LegalPage type="terms" onBack={() => router.push('/')} />;
}

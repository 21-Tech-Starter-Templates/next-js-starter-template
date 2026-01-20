import { signOut } from '@/auth';
import { redirect } from 'next/navigation';

export default async function SignOutPage() {
  await signOut();
  redirect('/');
}

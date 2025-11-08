import { requireAuth } from '@/lib/auth-utils';

export default async function Page() {
  // This page is already protected by the layout
  // The requireAuth call is redundant but ensures server-side protection
  await requireAuth();

  return <>Coming Soon</>;
}

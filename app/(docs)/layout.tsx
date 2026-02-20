import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/app/layout.config';

export default function DocsLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeLayout {...baseOptions}>
      {children}
    </HomeLayout>
  );
}

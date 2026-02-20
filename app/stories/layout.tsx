import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/app/layout.config';

export default function StoriesLayout({
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

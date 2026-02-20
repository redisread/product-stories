import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/app/layout.config';

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeLayout
      {...baseOptions}
      nav={{
        ...baseOptions.nav,
        transparentMode: 'top',
      }}
    >
      {children}
    </HomeLayout>
  );
}

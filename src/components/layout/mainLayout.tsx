// components/layouts/MainLayout.tsx

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return <main className="flex-1 overflow-auto">{children}</main>;
}

import Appbar from '@/components/top-bar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Appbar />
      <main className='flex-1 container mx-auto px-4 pt-20'>{children}</main>
    </div>
  );
};

export default Layout;

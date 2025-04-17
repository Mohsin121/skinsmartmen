import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './SideBar';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden ">
      <div className='max-w-4xl'>
      <Sidebar />
      </div>
      <div className="flex-grow flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
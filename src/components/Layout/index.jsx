
import {  Outlet } from 'react-router-dom';

import Header from './Header';
import Sidebar from './SideBar';



const Layout = () => {
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <div className="flex-grow flex flex-col">
        <Header />
        <div className="flex-grow overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
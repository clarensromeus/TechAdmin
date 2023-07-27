import * as React from 'react';
import { Outlet } from 'react-router-dom';

const Students: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default Students;

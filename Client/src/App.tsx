// internal imports of sources
import React, { FC, Suspense } from 'react';
// external imports of sources
import CraftingRouter from './pickRouter';
import LazyLoadRoutes from './utils/LazyLoadRoute';
import './App';

/*
 * the main file of the project
 ? this page is like a tunnel as the first-seen page off the project
**
*/

// this is the main app code
const App: FC = () => {
  return (
    <div className="App">
      <Suspense fallback={<LazyLoadRoutes />}>
        <CraftingRouter />
      </Suspense>
    </div>
  );
};

export default App;

import React from 'react';
import NavigationBar from './NavigationBar';

const Layout = ({ children }) => {
  return (
    <div className="App">
      <NavigationBar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
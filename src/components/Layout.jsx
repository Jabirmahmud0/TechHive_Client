import React, { useContext } from 'react';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './Chatbot';
import { ThemeContext } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'light' ? 'light-mode bg-dark-light text-text-primary-light' : 'bg-dark text-text-primary'} font-sans`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow container mx-auto px-8 py-12">
        {children}
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
};

export default Layout;
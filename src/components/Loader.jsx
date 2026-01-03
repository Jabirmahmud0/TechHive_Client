import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full min-h-[200px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-4 border-secondary opacity-20"></div>
      </div>
    </div>
  );
};

export default Loader;
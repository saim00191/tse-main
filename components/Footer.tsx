import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className='h-[40px] bg-white border-t-2   text-purple-600 flex items-center justify-center border-gray-300 text-[14px]'>
      © {currentYear} All rights reserved
    </div>
  );
};

export default Footer;

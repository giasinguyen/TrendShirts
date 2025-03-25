import React from 'react';

const Button = ({ onClick, children, className, disabled }) => {
  return (
    <button 
      onClick={onClick} 
      className={`btn ${className}`} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
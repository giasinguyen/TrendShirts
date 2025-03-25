import React from 'react';
import './Spinner.css'; // Assuming you have a CSS file for styling the spinner

const Spinner = () => {
  return (
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  );
};

export default Spinner;
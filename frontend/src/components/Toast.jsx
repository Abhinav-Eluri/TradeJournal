import React from 'react';

const Toast = ({ message, type, show }) => {
  if (!show) return null;

  return (
    <div className={`fixed bottom-5 right-5 p-4 rounded shadow-lg transition-all duration-300 
            ${type === "success" ? "bg-green-500 text-white" :
      type === "error" ? "bg-red-500 text-white" :
        "bg-blue-500 text-white"}`}>
      {message}
    </div>
  );
};

export default Toast;

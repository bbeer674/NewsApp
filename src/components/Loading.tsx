import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-blue-500 border-gray-300"></div>
    </div>
  );
};

export default Loading;

import React from 'react';

export default function ColdStartModal({ isVisible }) {
  if (!isVisible) return null;

  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 transition-opacity duration-300">
      
      {/* Modal Box */}
      <div className="flex flex-col items-center max-w-md p-8 text-center border shadow-2xl bg-slate-800 border-slate-700 rounded-2xl">
        
        {/* Animated Spinner */}
        {/* <div className="relative flex items-center justify-center w-16 h-16 mb-6">
          <div className="absolute w-full h-full border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          <div className="absolute w-10 h-10 border-4 border-b-transparent border-yellow-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        </div> */}

        
        <h3 className="text-xl font-bold tracking-wide text-white mb-2">
          Waking up the server...
        </h3>

       
        <p className="text-sm leading-relaxed text-slate-400">
          Since this project uses a free hosting service Render.io, the backend goes to sleep after 15 minutes of inactivity. 
          <br className="mb-2" />
          It usually takes about 30 to 50 seconds to spin back up. Please Wait ...
        </p>

      </div>
    </div>
  );
}


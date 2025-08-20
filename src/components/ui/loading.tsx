import React from 'react';
import { Music } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-3">
            <Music className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wider">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              AbhiMusicKeys
            </span>
          </h1>
        </div>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white text-lg">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading; 

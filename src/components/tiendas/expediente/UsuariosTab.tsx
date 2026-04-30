'use client';
import React from 'react';

interface Props {
  users: any[];
}

const UsuariosTab: React.FC<Props> = ({ users }) => {
  return (
    <div className="p-6 min-h-[400px]">
      <div className="flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-800 tracking-widest uppercase">
            Usuarios Asignados
          </h3>
          <span className="text-xs font-bold text-[#db3b2b] bg-red-50 px-3 py-1 rounded-full">
            {users?.length || 0} {(users?.length === 1) ? 'Usuario' : 'Usuarios'}
          </span>
        </div>
        
        <div className="p-4 flex-1 overflow-auto">
          {users && users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {users.map((user: any, idx: number) => (
                <div key={user._id || idx} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all group">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#db3b2b] font-bold text-lg shrink-0 group-hover:scale-110 transition-transform">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {user.name || 'Sin nombre'}
                    </p>
                    <p className="text-xs text-gray-500 font-medium truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-xl border border-dashed border-gray-200 m-2">
              <span className="w-2 h-2 rounded-full bg-gray-300 mb-2" />
              <span className="text-xs text-gray-400 font-bold uppercase italic tracking-widest">Sin asignar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsuariosTab;

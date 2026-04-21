import React from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import { X, User, Mail } from 'lucide-react';
import { StoreUser } from '../../models/store';

interface Props {
  open: boolean;
  onClose: () => void;
  users: StoreUser[];
  storeName: string;
}

const UsersListModal: React.FC<Props> = ({ open, onClose, users, storeName }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }
      }}
    >
      <div className="bg-[#db3b2b] px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-white text-lg font-black uppercase italic tracking-tight leading-none">
            Responsables Asignados
          </h3>
          <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">
            {storeName}
          </span>
        </div>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <X size={20} />
        </IconButton>
      </div>

      <DialogContent sx={{ p: 4, backgroundColor: '#fcfcfc' }}>
        <div className="space-y-3">
          {users.map((user, idx) => (
            <div 
              key={user._id || idx}
              className="group flex flex-col p-4 rounded-xl bg-white border border-gray-100 hover:border-[#db3b2b]/20 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#db3b2b] group-hover:bg-[#db3b2b] group-hover:text-white transition-colors">
                  <User size={16} />
                </div>
                <span className="text-sm font-black text-gray-800 uppercase tracking-tight">
                  {user.personal_info?.full_name || 'Sin nombre registrado'}
                </span>
              </div>
              <div className="flex items-center gap-3 pl-11">
                <Mail size={14} className="text-gray-400" />
                <span className="text-[11px] font-bold text-gray-500 group-hover:text-[#db3b2b] transition-colors">
                  {user.email}
                </span>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center opacity-30">
              <User size={48} className="text-gray-300 mb-2" />
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Sin usuarios asignados</p>
            </div>
          )}
        </div>
      </DialogContent>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-800 text-white-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
        >
          Cerrar
        </button>
      </div>
    </Dialog>
  );
};

export default UsersListModal;

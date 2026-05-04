'use client';
import React, { useState } from 'react';
import { Users, Search, Store, Phone, Mail, User as UserIcon, Tag, ShieldCheck, Building2 } from 'lucide-react';
import { Button, CircularProgress, Alert, Chip, Divider, Skeleton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getStoresByUserEmail } from '../services/storeService';

const UsuariosT1: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await getStoresByUserEmail(email);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Error al buscar las tiendas del usuario');
    } finally {
      setLoading(false);
    }
  };

  // Como la búsqueda es por email, tomamos el primer resultado del array devuelto por el servicio o el objeto directo
  const userData = Array.isArray(results) ? results[0] : results;

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Nombre de la Tienda', flex: 1, minWidth: 200 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 150,
      renderCell: (params) => (
        <Chip
          icon={<ShieldCheck size={16} />}
          label={params.value}
          size="small"
          color={params.value === 'admin' ? 'error' : 'default'}
          variant={params.value === 'admin' ? 'filled' : 'outlined'}
          sx={{ display: 'flex', width: 'fit-content', mt: 1 }}
        />
      )
    },
    {
      field: 'creation_date',
      headerName: 'Creación',
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString('es-MX')
    },
    {
      field: 'services',
      headerName: 'Servicios Activos',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-1 items-center h-full pt-1">
          {params.value?.map((svc: any) => (
            <Chip
              key={svc.name}
              label={svc.name}
              size="small"
              sx={{
                bgcolor: svc.status === 'active' ? '#e8f5e9' : '#f5f5f5',
                color: svc.status === 'active' ? '#2e7d32' : '#757575',
                fontWeight: 500,
                border: '1px solid',
                borderColor: svc.status === 'active' ? '#a5d6a7' : '#e0e0e0',
                height: '24px'
              }}
            />
          ))}
          {(!params.value || params.value.length === 0) && (
            <span className="text-sm text-gray-400">Sin servicios</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#db3b2b]">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0 tracking-tight">Usuarios T1</h1>
          <p className="text-gray-500 mt-1">Gestión de usuarios de plataforma T1 y sus tiendas</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label htmlFor="search-email" className="block text-sm font-medium text-gray-700 mb-2 ml-1">
              Correo Electrónico
            </label>
            <div className="relative group">

              <input
                id="search-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#db3b2b] focus:ring-4 focus:ring-red-50 transition-all outline-none text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !email.trim()}
            sx={{
              height: '52px',
              px: 4,
              borderRadius: '12px',
              backgroundColor: '#db3b2b',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(219, 59, 43, 0.2)',
              '&:hover': {
                backgroundColor: '#b92d1f',
                boxShadow: '0 6px 16px rgba(219, 59, 43, 0.3)',
              },
              '&.Mui-disabled': {
                backgroundColor: '#f3f4f6',
                color: '#9ca3af'
              }
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Search size={20} />}
          >
            {loading ? 'Buscando...' : 'Buscar Tiendas'}
          </Button>
        </form>
      </div>

      {error && (
        <Alert severity="error" className="mb-6">
          {error}
        </Alert>
      )}

      {loading && (
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton variant="circular" width={64} height={64} />
              <div className="flex-1">
                <Skeleton variant="text" width="30%" height={40} />
                <Skeleton variant="text" width="15%" height={24} />
              </div>
            </div>
            <Divider className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Skeleton variant="rectangular" height={24} className="rounded" />
              <Skeleton variant="rectangular" height={24} className="rounded" />
            </div>
          </div>
          <Skeleton variant="text" width="20%" height={32} />
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: 400 }}>
            <Skeleton variant="rectangular" height={60} className="w-full border-b border-gray-100" />
            <Skeleton variant="rectangular" height={50} className="w-full my-1" />
            <Skeleton variant="rectangular" height={50} className="w-full my-1" />
            <Skeleton variant="rectangular" height={50} className="w-full my-1" />
            <Skeleton variant="rectangular" height={50} className="w-full my-1" />
            <Skeleton variant="rectangular" height={50} className="w-full my-1" />
          </div>
        </div>
      )}

      {!loading && userData && (
        <div className="flex-1 overflow-auto">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <UserIcon size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {userData.name} {userData.surname}
                </h2>
                <div className="flex items-center text-gray-500 gap-2 mt-1">
                  <Tag size={16} />
                  <span>ID: {userData.user_id}</span>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="text-gray-400" size={20} />
                <span className="font-medium">{userData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="text-gray-400" size={20} />
                <span className="font-medium">{userData.cell_phone_number || 'No especificado'}</span>
              </div>
            </div>
          </div>

          {/* Stores Section */}
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 size={24} className="text-[#db3b2b]" />
            Tiendas Asociadas ({userData.stores?.length || 0})
          </h3>

          {userData.stores && userData.stores.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={userData.stores}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 100 } },
                  sorting: {
                    sortModel: [{ field: 'creation_date', sort: 'desc' }],
                  },
                }}
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f3f4f6',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    color: '#374151',
                    fontWeight: 600,
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#fef2f2',
                  }
                }}
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 border-dashed p-10 text-center">
              <Store size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Este usuario no tiene tiendas asociadas.</p>
            </div>
          )}
        </div>
      )}

      {!userData && !loading && !error && results === null && (
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-50 p-6 rounded-full mb-6">
            <Search size={48} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Buscar Usuario</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Ingresa un correo electrónico en la barra de búsqueda para ver el detalle y las tiendas asociadas al usuario.
          </p>
        </div>
      )}

      {!userData && !loading && !error && results !== null && (
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 p-6 rounded-full mb-6">
            <UserIcon size={48} className="text-[#db3b2b]" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Usuario no encontrado</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            No se encontró ningún usuario registrado con el correo <strong>{email}</strong>.
            Por favor, verifica que el correo sea correcto e intenta de nuevo.
          </p>
          <Button
            variant="text"
            onClick={() => { setResults(null); setEmail(''); }}
            sx={{ mt: 2, color: '#db3b2b', textTransform: 'none', fontWeight: 600 }}
          >
            Limpiar búsqueda
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsuariosT1;

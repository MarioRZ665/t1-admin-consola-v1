'use client';
import React, { useState } from 'react';
import { MoreVertical, ChevronDown, Eye, UserPlus, UserMinus } from 'lucide-react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import ExpedienteModal from './expediente/ExpedienteModal';
import AsignarSoporteModal from './AsignarSoporteModal';
// import UsersListModal from './UsersListModal';
import storeService from '../../services/storeService';
import { StoreDetail } from '../../models/store';

const Tiendas: React.FC = () => {
    const [tiendas, setTiendas] = useState<StoreDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [categoryAnchorEl, setCategoryAnchorEl] = useState<null | HTMLElement>(null);
    const [searchCategory, setSearchCategory] = useState<'Nombre' | 'IDT1' | 'Email'>('Nombre');

    const [expedienteOpen, setExpedienteOpen] = useState(false);
    const [selectedTienda, setSelectedTienda] = useState<StoreDetail | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [assignOpen, setAssignOpen] = useState(false);
    const [assignedStoreIds, setAssignedStoreIds] = useState<Set<number>>(new Set());

    // New state for Expanded Users list
    // const [usersModalOpen, setUsersModalOpen] = useState(false);
    // const [tiendaForUsers, setTiendaForUsers] = useState<StoreDetail | null>(null);

    const fetchTiendas = async (query: string = '') => {
        try {
            setLoading(true);
            setError(null);

            const cleanQuery = query.trim();
            let data: StoreDetail[] = [];

            if (searchCategory === 'Email' && cleanQuery) {
                const response = await storeService.getStoresByUserEmail(cleanQuery);
                // Si la respuesta es un array, tomamos las tiendas del primer usuario
                // Si es un objeto, tomamos sus tiendas
                const userData = Array.isArray(response) ? response[0] : response;
                data = userData?.stores || [];
            } else if (searchCategory === 'IDT1' && cleanQuery) {
                data = await storeService.getStoreInfo(cleanQuery);
            } else {
                data = await storeService.findStores(cleanQuery);
            }

            setTiendas(data);
        } catch (err: any) {
            console.error('Search error:', err);
            setError('No se encontraron resultados para la búsqueda');
            setTiendas([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignedStores = async () => {
        try {
            const response = await storeService.getStoresByUserEmail('soporte@t1envios.com');
            // storeService.getStoresByUserEmail ya retorna response.data
            const userData = Array.isArray(response) ? response[0] : response;
            const stores = userData?.stores || [];
            const ids = new Set<number>(stores.map((s: any) => s.id));
            setAssignedStoreIds(ids);
        } catch (err) {
            console.error('Error fetching assigned stores:', err);
        }
    };

    React.useEffect(() => {
        fetchTiendas();
        fetchAssignedStores();
    }, []);




    const menuOpen = Boolean(anchorEl);
    const categoryMenuOpen = Boolean(categoryAnchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
        setCategoryAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCategoryClose = (category?: 'Nombre' | 'IDT1' | 'Email') => {
        if (category) setSearchCategory(category);
        setSearchTerm('');
        setCategoryAnchorEl(null);
    };

    /* 
    const handleExpandUsers = (tienda: StoreDetail) => {
        setTiendaForUsers(tienda);
        setUsersModalOpen(true);
    };
    */


    const columns: GridColDef<StoreDetail>[] = [
        {
            field: 'id',
            headerName: 'ID-T1',
            width: 150,
            renderCell: (params: GridRenderCellParams<StoreDetail>) => (
                <span className="font-extrabold text-[#db3b2b] text-base">{params.value}</span>
            )
        },
        {
            field: 'name',
            headerName: 'TIENDA',
            flex: 1,
            renderCell: (params: GridRenderCellParams<StoreDetail>) => (
                <span className="font-extrabold text-gray-800 uppercase text-sm tracking-tight">{params.value}</span>
            )
        },
        {
            field: 'users',
            headerName: 'ASIGNACIÓN',
            flex: 1.5,
            renderCell: (params: GridRenderCellParams<StoreDetail>) => {
                const isAssigned = assignedStoreIds.has(params.row.id);
                return isAssigned ? (
                    <span className="text-sm font-medium text-gray-600">
                        soporte@t1envios.com
                    </span>
                ) : (
                    <span className="text-sm text-gray-400 italic">Sin asignar</span>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'ACCIONES',
            width: 100,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params: GridRenderCellParams<StoreDetail>) => (
                <div className="pr-2">
                    <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, params.row.id)}
                        sx={{ color: '#db3b2b' }}
                        className="hover:bg-gray-50 transition-colors"
                    >
                        <MoreVertical size={20} />
                    </IconButton>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 3px;
                        height: 3px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f1f1;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #db3b2b;
                        border-radius: 10px;
                    }
                `}
            </style>

            {/* Search Bar Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4 border border-gray-50">
                <div className="flex-1 flex items-center border border-gray-200 rounded-lg overflow-hidden h-11 bg-white">
                    <div
                        onClick={handleCategoryClick}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 min-w-[100px] md:min-w-[140px] bg-white border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-xs md:text-sm font-bold text-gray-800">{searchCategory}</span>
                        <ChevronDown size={14} className="text-gray-400 ml-auto" />
                    </div>
                    <Menu
                        anchorEl={categoryAnchorEl}
                        open={categoryMenuOpen}
                        onClose={() => handleCategoryClose()}
                        disableScrollLock
                        PaperProps={{
                            sx: {
                                borderRadius: '10px',
                                mt: 0.5,
                                minWidth: '140px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                                border: '1px solid #f1f1f1',
                                '& .MuiList-root': {
                                    p: 0,
                                },
                                '& .MuiMenuItem-root': {
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#4b5563',
                                    py: 1.5,
                                    px: 2,
                                    '&:hover': {
                                        backgroundColor: '#f9fafb',
                                        color: '#db3b2b',
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: '#f3f4f6',
                                        color: '#db3b2b',
                                    }
                                }
                            }
                        }}
                    >
                        <MenuItem onClick={() => handleCategoryClose('Nombre')} selected={searchCategory === 'Nombre'}>Nombre</MenuItem>
                        <MenuItem onClick={() => handleCategoryClose('IDT1')} selected={searchCategory === 'IDT1'}>IDT1</MenuItem>
                        <MenuItem onClick={() => handleCategoryClose('Email')} selected={searchCategory === 'Email'}>Email</MenuItem>
                    </Menu>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchTiendas(searchTerm)}
                        className="flex-1 px-4 py-2 bg-transparent !border-none !shadow-none !ring-0 !outline-none text-sm text-gray-400 font-medium w-full"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchTiendas(searchTerm)}
                        disabled={loading}
                        className="flex-1 md:flex-none bg-[#db3b2b] text-white-2 px-6 md:px-10 h-11 rounded-lg font-extrabold text-sm tracking-[0.1em] hover:bg-[#c43527] transition-all hover:shadow-lg uppercase whitespace-nowrap disabled:opacity-50"
                    >
                        {loading ? '...' : 'BUSCAR'}
                    </button>
                    <button
                        onClick={() => { setSearchTerm(''); fetchTiendas(''); }}
                        className="flex-1 md:flex-none h-11 px-4 text-[#c1c1c1] text-[10px] md:text-[11px] font-bold hover:text-gray-500 transition-colors uppercase tracking-[0.1em] md:tracking-[0.2em] whitespace-nowrap border border-gray-100 md:border-none rounded-lg md:rounded-none"
                    >
                        VER TODAS
                    </button>
                </div>
            </div>


            {error && (
                <div className="bg-red-50 border border-red-100 text-[#db3b2b] px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#db3b2b]" />
                    {error}
                </div>
            )}

            {/* Table Section (MUI Data Grid) */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden p-2">
                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={tiendas}
                        columns={columns}
                        loading={loading}
                        disableRowSelectionOnClick
                        pageSizeOptions={[10, 25, 50]}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 250 },
                            },
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                        }}
                        rowHeight={64}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-toolbarContainer': {
                                padding: '16px',
                                borderBottom: '1px solid #f3f4f6',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'white',
                                color: '#a3a3a3',
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                borderBottom: '1px solid #f3f4f6',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f9fafb',
                                display: 'flex',
                                alignItems: 'center',
                            },
                            '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
                                outline: 'none !important',
                            },
                            '& .MuiDataGrid-columnSeparator': {
                                display: 'none',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#fafafa',
                            },
                        }}
                    />
                </div>
            </div>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                disableScrollLock
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        mt: 0.5,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        border: '1px solid #f1f1f1',
                        '& .MuiList-root': {
                            py: 0.5,
                        }
                    }
                }}
            >
                <MenuItem onClick={() => {
                    const t = tiendas.find(x => x.id === selectedId);
                    if (t) {
                        setSelectedTienda(t);
                        setExpedienteOpen(true);
                    }
                    handleClose();
                }} sx={{ py: 1.5, px: 3 }}>
                    <ListItemIcon sx={{ minWidth: '36px !important' }}>
                        <Eye size={18} className="text-[#db3b2b]" />
                    </ListItemIcon>
                    <ListItemText
                        primary="VER EXPEDIENTE"
                        primaryTypographyProps={{
                            variant: 'caption',
                            fontWeight: 800,
                            color: '#db3b2b',
                            letterSpacing: '0.05em'
                        }}
                    />
                </MenuItem>

                <div className="mx-3 border-t border-gray-50 my-0.5" />

                <MenuItem onClick={() => {
                    const t = tiendas.find(x => x.id === selectedId);
                    if (t) {
                        setSelectedTienda(t);
                        setAssignOpen(true);
                    }
                    handleClose();
                }} sx={{ py: 1.5, px: 3 }}>
                    <ListItemIcon sx={{ minWidth: '36px !important' }}>
                        <UserPlus size={18} className="text-[#10b981]" />
                    </ListItemIcon>
                    <ListItemText
                        primary="ASIGNAR SOPORTE"
                        primaryTypographyProps={{
                            variant: 'caption',
                            fontWeight: 800,
                            color: '#10b981',
                            letterSpacing: '0.05em'
                        }}
                    />
                </MenuItem>

                <div className="mx-3 border-t border-gray-50 my-0.5" />

                <MenuItem onClick={async () => {
                    const t = tiendas.find(x => x.id === selectedId);
                    if (t) {
                        try {
                            setLoading(true);

                            // Eliminar al usuario ghost del sistema externo (id 111215 referenciado)
                            await storeService.removeUserSystem(111215, t.id);

                            // Borrar la asignación en el sistema local
                            await storeService.removeAssignment(t.id);

                            await fetchTiendas(searchTerm);
                            await fetchAssignedStores();
                        } catch (err: any) {
                            console.error('Error removing assignment:', err);
                            setError(err.message || 'Error al quitar la asignación');
                            setLoading(false);
                        }
                    }
                    handleClose();
                }} sx={{ py: 1.5, px: 3 }}>
                    <ListItemIcon sx={{ minWidth: '36px !important' }}>
                        <UserMinus size={18} className="text-[#db3b2b]" />
                    </ListItemIcon>
                    <ListItemText
                        primary="QUITAR ASIGNACIÓN"
                        primaryTypographyProps={{
                            variant: 'caption',
                            fontWeight: 800,
                            color: '#db3b2b',
                            letterSpacing: '0.05em'
                        }}
                    />
                </MenuItem>
            </Menu>

            <ExpedienteModal
                open={expedienteOpen}
                onClose={() => setExpedienteOpen(false)}
                tienda={selectedTienda}
            />

            <AsignarSoporteModal
                open={assignOpen}
                onClose={() => {
                    setAssignOpen(false);
                    fetchAssignedStores();
                }}
                tiendaName={selectedTienda?.name || ''}
                storeId={selectedTienda?.id || ''}
            />

            {/* 
            <UsersListModal 
                open={usersModalOpen}
                onClose={() => setUsersModalOpen(false)}
                users={tiendaForUsers?.users || []}
                storeName={tiendaForUsers?.name || ''}
            />
            */}
        </div>
    );
};

export default Tiendas;

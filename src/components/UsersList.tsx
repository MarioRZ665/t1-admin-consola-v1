import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Alert, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, IconButton, Skeleton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { X, MoreVertical, Edit2, UserMinus, UserCheck } from 'lucide-react';
import type { User } from '../models/user';
import userService from '../services/userService';
import { getUserRole } from '../utils/auth';
import CreateUser from './CreateUser';

interface UserRow {
	id: string;
	name: string;
	email: string;
	role: string;
	phone: string;
	createdAt: string;
	_disabled: boolean;
}

const UsersList: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { isCollapsed } = useOutletContext<{ isCollapsed: boolean }>();

	const [editOpen, setEditOpen] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState('');
	const [editEmail, setEditEmail] = useState('');
	const [editRole, setEditRole] = useState('');
	const [editLoading, setEditLoading] = useState(false);

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmId, setConfirmId] = useState<string | null>(null);
	const [confirmLoading, setConfirmLoading] = useState(false);

	const [createOpen, setCreateOpen] = useState(false);
	const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
		open: false, message: '', severity: 'success'
	});

	// Menu state
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const menuOpen = Boolean(anchorEl);

	const currentRole = getUserRole();
	const roleLabels: Record<string, string> = {
		secondary_user: 'Usuario secundario',
		super_user: 'Super usuario',
		ADMIN: 'Administrador',
	};

	const allowedRoles = currentRole === 'super_user'
		? ['super_user', 'secondary_user', 'ADMIN']
		: ['secondary_user', 'ADMIN'];

	useEffect(() => {
		const timer = setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 300);
		return () => clearTimeout(timer);
	}, [isCollapsed]);

	const loadUsers = async () => {
		setLoading(true);
		try {
			const data = await userService.getUsers();
			setUsers(data || []);
		} catch (e: any) {
			setError(e.message || 'Error cargando usuarios');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	// Handlers de Usuario
	const handleUserCreated = (user: User) => {
		setUsers((prev) => [user, ...prev]);
		setSnack({ open: true, message: 'Usuario creado correctamente', severity: 'success' });
		setTimeout(() => setCreateOpen(false), 1200);
	};

	const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
		setAnchorEl(event.currentTarget);
		setSelectedUserId(id);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
		setSelectedUserId(null);
	};

	const handleOpenEdit = (id: string) => {
		const u = users.find((x) => String(x._id || x.id) === String(id));
		if (!u) return;
		setEditingId(id);
		setEditName(u.name);
		setEditEmail(u.email);
		setEditRole(u.role);
		setEditOpen(true);
	};

	const handleSubmitEdit = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!editingId) return;
		setEditLoading(true);
		try {
			const payload = { name: editName, email: editEmail, role: editRole };
			const updated = await userService.updateUser(editingId, payload);
			setUsers((prev) => prev.map((p) => (String(p._id || p.id) === String(editingId) ? { ...p, ...updated } : p)));
			setSnack({ open: true, message: 'Usuario actualizado', severity: 'success' });
			setEditOpen(false);
		} catch (err: any) {
			setSnack({ open: true, message: err?.message || 'Error actualizando', severity: 'error' });
		} finally {
			setEditLoading(false);
		}
	};

	const handleConfirmDelete = async () => {
		if (!confirmId) return;
		setConfirmLoading(true);
		try {
			await userService.deleteUser(confirmId);
			setUsers((prev) => prev.filter((p) => String(p._id || p.id) !== String(confirmId)));
			setSnack({ open: true, message: 'Usuario eliminado', severity: 'success' });
			setConfirmOpen(false);
		} catch (err: any) {
			setSnack({ open: true, message: err?.message || 'Error eliminando usuario', severity: 'error' });
		} finally {
			setConfirmLoading(false);
		}
	};

	// Transformación de datos para el Grid
	const rows: UserRow[] = users.map((u, idx) => ({
		id: u._id ? String(u._id) : (u.id ? String(u.id) : String(idx + 1)),
		name: u.name,
		email: u.email,
		role: u.disabled ? 'Deshabilitado' : (roleLabels[u.role] || u.role),
		phone: u.phone || '',
		createdAt: u.createdAt ? new Date(u.createdAt).toLocaleString() : '-',
		_disabled: Boolean(u.disabled),
	}));

	// Definición de Columnas
	const columns: GridColDef<UserRow>[] = [

		{ field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150 },
		{ field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
		{ field: 'role', headerName: 'Rol', width: 160 },
		{
			field: 'phone',
			headerName: 'Teléfono',
			width: 150,
			valueFormatter: (value: string) => {
				if (!value) return '-';
				const clean = value.replace(/\D/g, '');
				// Formato México con código de país (52 + 10 dígitos)
				if (clean.length === 12 && clean.startsWith('52')) {
					return `+52 (${clean.slice(2, 4)}) ${clean.slice(4, 8)}-${clean.slice(8)}`;
				}
				// Formato 10 dígitos estándar
				if (clean.length === 10) {
					return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
				}
				return value.startsWith('+') ? value : `+${value}`;
			},
		},
		{
			field: 'actions',
			headerName: 'Acciones',
			width: 100,
			sortable: false,
			renderCell: (params: GridRenderCellParams<UserRow>) => (
				<div className="flex items-center justify-center h-full">
					<IconButton
						onClick={(e) => handleOpenMenu(e, params.row.id)}
						size="small"
						className="hover:bg-gray-100 transition-colors"
						sx={{ color: '#db3b2b' }}
					>
						<MoreVertical size={20} />
					</IconButton>
				</div>
			),
		},
	];

	return (
		<div className="w-full p-4 sm:p-6 lg:p-0">
			<h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Usuarios</h2>
			<div className="bg-white border border-gray-100 p-4 md:p-6 rounded-2xl shadow-sm">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end mb-6 gap-3">
					<button
						onClick={loadUsers}
						className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold transition-all hover:bg-gray-50 flex items-center justify-center gap-2"
					>
						Actualizar
					</button>
					<button
						onClick={() => setCreateOpen(true)}
						className="px-6 py-2.5 rounded-xl bg-[#db3b2b] text-white font-semibold text-sm transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
					>
						Crear usuario
					</button>
				</div>


				{loading ? (
					<div className="space-y-4">
						<Skeleton variant="rectangular" height={50} className="rounded-xl bg-white/5" />
						{[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" height={45} className="rounded-lg bg-white/5" />)}
					</div>
				) : error ? (
					<Alert severity="error" className="rounded-xl">{error}</Alert>
				) : (
					<div style={{ height: window.innerWidth < 768 ? 450 : 550, width: '100%' }}>
						<DataGrid
							rows={rows}
							columns={columns}
							pageSizeOptions={[10, 25, 50]}
							initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
							disableRowSelectionOnClick
							sx={{
								border: 'none',
								'& .MuiDataGrid-cell': { 
									color: 'inherit', 
									borderBottom: '1px solid #f9fafb',
									display: 'flex',
									alignItems: 'center'
								},
								'& .MuiDataGrid-columnHeaders': { 
									backgroundColor: 'white', 
									color: '#a3a3a3',
									fontSize: '0.7rem',
									fontWeight: '800',
									letterSpacing: '0.15em',
									textTransform: 'uppercase',
									borderBottom: '1px solid #f3f4f6'
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
				)}
			</div>

			{/* Actions Menu */}
			<Menu
				anchorEl={anchorEl}
				open={menuOpen}
				onClose={handleCloseMenu}
				PaperProps={{
					sx: {
						borderRadius: '10px',
						mt: 1,
						minWidth: '180px',
						boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
						border: '1px solid #f1f1f1',
						'& .MuiList-root': { p: 0.5 },
					}
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				disableScrollLock
			>
				<MenuItem onClick={() => {
					if (selectedUserId) handleOpenEdit(selectedUserId);
					handleCloseMenu();
				}} sx={{ py: 1.2, px: 2 }}>
					<ListItemIcon sx={{ minWidth: '32px !important' }}>
						<Edit2 size={16} className="text-[#db3b2b]" />
					</ListItemIcon>
					<ListItemText 
						primary="ACTUALIZAR" 
						primaryTypographyProps={{ 
							variant: 'caption', 
							fontWeight: 800, 
							color: '#db3b2b',
							letterSpacing: '0.05em'
						}} 
					/>
				</MenuItem>
				<div className="mx-2 border-t border-gray-50 my-0.5" />
				{users.find(u => String(u.id) === String(selectedUserId))?.disabled ? (
					<MenuItem onClick={() => {
						if (selectedUserId) {
							setConfirmId(selectedUserId);
							setConfirmOpen(true);
						}
						handleCloseMenu();
					}} sx={{ py: 1.2, px: 2 }}>
						<ListItemIcon sx={{ minWidth: '32px !important' }}>
							<UserCheck size={16} className="text-[#10b981]" />
						</ListItemIcon>
						<ListItemText 
							primary="HABILITAR" 
							primaryTypographyProps={{ 
								variant: 'caption', 
								fontWeight: 800, 
								color: '#10b981',
								letterSpacing: '0.05em'
							}} 
						/>
					</MenuItem>
				) : (
					<MenuItem onClick={() => {
						if (selectedUserId) {
							setConfirmId(selectedUserId);
							setConfirmOpen(true);
						}
						handleCloseMenu();
					}} sx={{ py: 1.2, px: 2 }}>
						<ListItemIcon sx={{ minWidth: '32px !important' }}>
							<UserMinus size={16} className="text-[#db3b2b]" />
						</ListItemIcon>
						<ListItemText 
							primary="DESHABILITAR" 
							primaryTypographyProps={{ 
								variant: 'caption', 
								fontWeight: 800, 
								color: '#db3b2b',
								letterSpacing: '0.05em'
							}} 
						/>
					</MenuItem>
				)}
			</Menu>

			{/* Modal Crear */}
			<Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: '18px' } }}>
				<IconButton onClick={() => setCreateOpen(false)} sx={{ position: 'absolute', right: 16, top: 16 }}><X size={20} /></IconButton>
				<DialogTitle>Crear usuario</DialogTitle>
				<DialogContent><CreateUser onCreated={handleUserCreated} /></DialogContent>
			</Dialog>

			{/* Modal Editar */}
			<Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '18px' } }}>
				<IconButton onClick={() => setEditOpen(false)} sx={{ position: 'absolute', right: 16, top: 16 }}><X size={20} /></IconButton>
				<DialogTitle>Actualizar usuario</DialogTitle>
				<DialogContent>
					<form id="edit-form" onSubmit={handleSubmitEdit} className="space-y-4 mt-4">
						<input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Nombre" className="w-full p-2 rounded bg-gray-50 border" required />
						<input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Email" className="w-full p-2 rounded bg-gray-50 border" required />
						<select value={editRole} onChange={e => setEditRole(e.target.value)} className="w-full p-2 rounded bg-gray-50 border">
							{allowedRoles.map(r => <option key={r} value={r}>{roleLabels[r] || r}</option>)}
						</select>
					</form>
				</DialogContent>
				<DialogActions sx={{ p: 3 }}>
					<button type="submit" form="edit-form" disabled={editLoading} className="px-6 py-2 rounded-xl btn-primary text-white-2 font-semibold">
						{editLoading ? 'Guardando...' : 'Guardar Cambios'}
					</button>
				</DialogActions>
			</Dialog>

			{/* Confirmación Habilitar/Deshabilitar */}
			<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} PaperProps={{ sx: { borderRadius: '18px' } }}>
				<DialogTitle>
					{users.find(u => String(u._id || u.id) === String(confirmId))?.disabled ? '¿Habilitar usuario?' : '¿Deshabilitar usuario?'}
				</DialogTitle>
				<DialogContent>
					<p className="text-sm text-gray-500">
						{users.find(u => String(u._id || u.id) === String(confirmId))?.disabled
							? 'Esta acción permitirá al usuario acceder al sistema nuevamente.'
							: 'Esta acción restringirá el acceso del usuario al sistema.'}
					</p>
				</DialogContent>
				<DialogActions sx={{ p: 3 }}>
					<button onClick={() => setConfirmOpen(false)} className="px-4 py-2 border border-gray-200 rounded-xl mr-2 text-sm">Cancelar</button>
					<button
						onClick={handleConfirmDelete}
						disabled={confirmLoading}
						className={`px-6 py-2 text-white-2 rounded-xl text-sm font-semibold transition-all ${users.find(u => String(u._id || u.id) === String(confirmId))?.disabled ? 'bg-[#10b981]' : 'bg-[#db3b2b]'
							}`}
					>
						{confirmLoading
							? (users.find(u => String(u._id || u.id) === String(confirmId))?.disabled ? 'Habilitando...' : 'Deshabilitando...')
							: (users.find(u => String(u._id || u.id) === String(confirmId))?.disabled ? 'Habilitar' : 'Deshabilitar')}
					</button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snack.open}
				autoHideDuration={3000}
				onClose={() => setSnack(s => ({ ...s, open: false }))}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert
					severity={snack.severity}
					onClose={() => setSnack(s => ({ ...s, open: false }))}
					sx={{ width: '100%', borderRadius: '12px' }}
				>
					{snack.message}
				</Alert>
			</Snackbar>
		</div>
	);
};

export default UsersList;
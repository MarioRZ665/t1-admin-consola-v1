import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Store } from 'lucide-react';
import auth, { getUserRole } from '../utils/auth';
import { UserRole } from '../models/roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons'

const Dashboard: React.FC = () => {
	const location = useLocation();
	const userRole = getUserRole();
	const isAdmin = userRole === UserRole.SUPER_USER;

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleSidebar = () => {
		if (window.innerWidth >= 1024) {
			setIsCollapsed(!isCollapsed);
		} else {
			setSidebarOpen(!sidebarOpen);
		}
	};

	return (
		<div className="flex h-screen overflow-hidden bg-gray-50">
			{/* Mobile Header */}
			<div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center px-4">
				<button
					onClick={toggleSidebar}
					className="p-2 rounded-xl bg-gray-50 text-[#db3b2b] hover:bg-gray-100 transition-colors"
				>
					<Menu size={20} />
				</button>
				<h1 className="ml-4 text-2xl font-black text-[#db3b2b] tracking-tight">T1</h1>
			</div>

			<aside
				className={`fixed lg:static top-0 left-0 h-full z-40 transform transition-all duration-300 bg-white border-r border-gray-200 flex flex-col p-4 lg:p-6 ${
					isCollapsed ? 'lg:w-20' : 'lg:w-64'
				} w-[280px] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
			>
				<div className={`flex items-center justify-between mb-10 ${isCollapsed ? 'lg:justify-center' : ''}`}>
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 min-w-[40px] flex items-center justify-center">
							<h1 className="text-3xl font-black text-[#db3b2b] m-0 leading-none tracking-tight">T1</h1>
						</div>
						{!isCollapsed && (
							<span className="text-xl font-bold tracking-tight whitespace-nowrap lg:block hidden">
								Admin
							</span>
						)}
					</div>
					<button 
						onClick={toggleSidebar}
						className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
					>
						<X size={20} />
					</button>
				</div>

				<nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
					<SidebarItem
						icon={<Store size={20} />}
						label="Tiendas"
						to="/dashboard/tiendas"
						active={location.pathname === '/dashboard/tiendas' || location.pathname === '/dashboard'}
						isCollapsed={isCollapsed}
						onClick={() => setSidebarOpen(false)}
					/>
					{isAdmin && (
						<SidebarItem
							icon={<FontAwesomeIcon icon={faUserPlus} style={{ fontSize: '18px' }} />}
							label="Usuarios"
							to="/dashboard/users"
							active={location.pathname === '/dashboard/users'}
							isCollapsed={isCollapsed}
							onClick={() => setSidebarOpen(false)}
						/>
					)}
					<SidebarItem
						icon={<FontAwesomeIcon icon={faUser} style={{ fontSize: '18px' }} />}
						label="Perfil"
						to="/dashboard/profile"
						active={location.pathname === '/dashboard/profile'}
						isCollapsed={isCollapsed}
						onClick={() => setSidebarOpen(false)}
					/>
				</nav>

				<button
					onClick={() => auth.logout()}
					className={`mt-auto flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-gray-600 hover:text-[#db3b2b] transition-all group overflow-hidden ${
						isCollapsed ? 'lg:justify-center' : 'lg:justify-start'
					}`}
				>
					<LogOut size={20} className="group-hover:translate-x-1 transition-transform min-w-[20px]" />
					{!isCollapsed && (
						<span className="font-semibold whitespace-nowrap lg:block hidden">
							Salir
						</span>
					)}
					<span className="font-semibold lg:hidden">Cerrar Sesión</span>
				</button>
			</aside>

			<main className="flex-1 overflow-y-auto relative pt-16 lg:pt-0">
				{/* Desktop Toggle Button */}
				<button
					onClick={toggleSidebar}
					className="hidden lg:flex absolute left-4 top-6 p-2 rounded-xl bg-white border border-gray-200 z-20 transition-all hover:bg-gray-50 text-[#db3b2b] shadow-sm items-center justify-center"
					aria-label="Toggle sidebar"
				>
					{isCollapsed ? <Menu size={18} /> : <X size={18} />}
				</button>

				<div className="p-4 sm:p-6 lg:p-8 lg:pl-20">
					<div className="max-w-[1600px] mx-auto">
						<div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[calc(100vh-8rem)]">
							<Outlet context={{ isCollapsed }} />
						</div>
					</div>
				</div>
			</main>

			{sidebarOpen && (
				<div 
					onClick={() => setSidebarOpen(false)} 
					className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
				/>
			)}
		</div>
	);
};



const SidebarItem = ({ icon, label, active = false, to, isCollapsed, onClick }: any) => {
	const base = `flex items-center gap-3 p-3 rounded-xl transition-all overflow-hidden ${isCollapsed ? 'lg:justify-center' : 'lg:justify-start'}`;
	const activeStyle: any = active
		? { backgroundColor: 'rgba(var(--brand-primary-rgb),0.08)', color: 'var(--brand-primary)', border: '1px solid rgba(var(--brand-primary-rgb),0.12)' }
		: { color: 'var(--text-muted)' };

	const content = (
		<>
			<div className="min-w-[20px]">{icon}</div>
			{!isCollapsed && (
				<span className="font-semibold whitespace-nowrap lg:block hidden">
					{label}
				</span>
			)}
			<span className="font-semibold lg:hidden">{label}</span>
		</>
	);

	if (to) {
		return (
			<Link to={to} className={base} style={activeStyle} onClick={onClick}>
				{content}
			</Link>
		);
	}

	return (
		<a href="#" className={base} style={activeStyle} onClick={onClick}>
			{content}
		</a>
	);
};


export default Dashboard;

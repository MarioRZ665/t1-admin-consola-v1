'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import auth, { getUserRole } from '../utils/auth';
import { UserRole } from '../models/roles';

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredRole?: UserRole | string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
	const router = useRouter();
	const [authorized, setAuthorized] = React.useState(false);

	React.useEffect(() => {
		if (!auth.isAuthenticated()) {
			router.replace('/auth/login');
			return;
		}

		if (requiredRole) {
			const userRole = getUserRole();
			if (userRole !== requiredRole) {
				router.replace('/dashboard');
				return;
			}
		}
		setAuthorized(true);
	}, [router, requiredRole]);

	if (!authorized) {
		return null; // Or a loading spinner
	}

	return <>{children}</>;
};

export default ProtectedRoute;

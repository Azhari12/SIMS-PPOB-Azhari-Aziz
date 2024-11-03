import { getAccessToken } from "@/auth";
import ScreenLoader from "@/components/loader/screen-loader";
import PrivateLayout from "@/layouts/private-layout";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
	if (!getAccessToken()) return <Navigate to="/login" />;

	return (
		<Suspense fallback={<ScreenLoader />}>
			<PrivateLayout />
		</Suspense>
	);
};

const GuestRoute = () => {
	return !getAccessToken() ? <Outlet /> : <Navigate to="/" />;
};

export { PrivateRoute, GuestRoute };

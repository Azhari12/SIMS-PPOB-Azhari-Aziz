import ErrorBoundary from "@/components/error-boundary";
import { createBrowserRouter } from "react-router-dom";
import { GuestRoute, PrivateRoute } from "./midleware";
import MainPage from "@/pages";
import TopUpPage from "@/pages/top-up";
import GuestLayout from "@/layouts/guest-layout";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/registrasi";

export const router = createBrowserRouter([
	{
		element: (
			<ErrorBoundary>
				<GuestRoute />
			</ErrorBoundary>
		),
		children: [
			{
				element: <GuestLayout />,
				children: [
					{ path: "login", element: <LoginPage /> },
					{ path: "registrasi", element: <RegisterPage /> },
				],
			},
		],
	},
	{
		path: "/",
		element: (
			<ErrorBoundary>
				<PrivateRoute />
			</ErrorBoundary>
		),
		children: [
			{ index: true, element: <MainPage /> },
			{ path: "top-up", element: <TopUpPage /> },
		],
	},
]);

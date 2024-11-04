import { createBrowserRouter } from "react-router-dom";

import ErrorBoundary from "@/components/error-boundary";
import { GuestRoute, PrivateRoute } from "./midleware";
import RegisterPage from "@/pages/auth/registrasi";
import TransactionPage from "@/pages/transaction";
import GuestLayout from "@/layouts/guest-layout";
import NotFoundPage from "@/pages/not-found";
import PurchasePage from "@/pages/purchase";
import LoginPage from "@/pages/auth/login";
import AccountPage from "@/pages/account";
import TopUpPage from "@/pages/top-up";
import MainPage from "@/pages";

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
			{ path: "purchase/:code", element: <PurchasePage /> },
			{ path: "transaction", element: <TransactionPage /> },
			{ path: "akun", element: <AccountPage /> },
		],
	},
	{
		path: "/*",
		element: <NotFoundPage />,
	},
]);

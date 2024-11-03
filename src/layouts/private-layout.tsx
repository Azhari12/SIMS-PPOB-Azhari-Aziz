import Navbar from "@/components/layouts/navbar";
import { useProfileSuspenseQuery } from "@/hooks/private.hook";
import { Outlet } from "react-router-dom";

const PrivateLayout = () => {
	useProfileSuspenseQuery();
	return (
		<div className="flex flex-col min-h-screen ">
			<Navbar />
			<main className="container mx-auto xl:px-32 mt-8 px-10 pb-4 flex-grow transition-all">
				<Outlet />
			</main>
		</div>
	);
};
export default PrivateLayout;

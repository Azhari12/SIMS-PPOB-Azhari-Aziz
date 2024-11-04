import { Outlet } from "react-router-dom";
import authImage from "@/assets/Illustrasi Login.png";

const GuestLayout = () => {
	return (
		<div className=" w-full h-screen md:flex md:justify-between relative">
			<div className="w-full md:w-[47.5%] flex justify-center xl:items-center p-4 lg:p-10 relative">
				<Outlet />
			</div>
			<div className="hidden md:fixed md:block top-0 right-0 w-full md:w-[52.5%] h-full overflow-hidden md:flex-1">
				<img
					alt="Auth Image"
					src={authImage}
					className="object-cover w-full h-full"
				/>
			</div>
		</div>
	);
};

export default GuestLayout;

import { BounceLoader } from "react-spinners";

const ScreenLoader = () => {
	return (
		<div className="w-full min-h-screen flex justify-center items-center">
			<BounceLoader color="#f42619" />
		</div>
	);
};

export default ScreenLoader;

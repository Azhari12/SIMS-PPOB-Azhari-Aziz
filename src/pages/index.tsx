import SliderBanner from "./main-components/slider-banner";
import ServiceList from "./main-components/service-list";
import HeaderLayout from "@/components/layouts/header";

const MainPage = () => {
	return (
		<section className="flex flex-col gap-[3rem]">
			<HeaderLayout />
			<ServiceList />
			<SliderBanner />
		</section>
	);
};

export default MainPage;

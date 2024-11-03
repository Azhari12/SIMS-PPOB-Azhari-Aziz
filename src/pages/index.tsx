import HeaderLayout from "@/components/layouts/header";
import ServiceList from "./main-components/service-list";
import SliderBanner from "./main-components/slider-banner";

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

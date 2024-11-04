import HeaderLayout from "@/components/layouts/header";
import { useServicesQuery } from "@/hooks/main-page.hook";
import { ServiceType } from "@/lib/types/services";
import { setServices } from "@/store/slices/services-slice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AmountForm from "./components/amount-form";

const PurchasePage = () => {
	const { code } = useParams();

	const services = useSelector((state: RootState) => state.services.services);
	const dispatch = useDispatch<AppDispatch>();

	const servicesQuery = useServicesQuery({ isEnable: !services.length });
	const servicesData = servicesQuery.data?.data as ServiceType[];

	const item = services.find((item) => item.service_code === code);

	useEffect(() => {
		if (servicesData?.length) dispatch(setServices(servicesData));
	}, [servicesData]);

	return (
		<section className="flex flex-col gap-[3rem]">
			<HeaderLayout />
			<div className="flex flex-col gap-5">
				<h3 className="font-medium text-gray-600 text-center sm:text-start">
					PemBayaran
				</h3>
				<div className="flex items-center gap-3">
					<img
						alt={item?.service_name}
						src={item?.service_icon}
						className="object-cover w-8 h-8"
					/>
					<h3 className="capitalize font-bold text-center sm:text-start">
						{item?.service_name}
					</h3>
				</div>
			</div>
			<AmountForm item={item} />
		</section>
	);
};

export default PurchasePage;
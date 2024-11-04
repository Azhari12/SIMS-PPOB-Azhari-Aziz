/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { setServices } from "@/store/slices/services-slice";
import { useServicesQuery } from "@/hooks/main-page.hook";
import { AppDispatch, RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceType } from "@/lib/types/services";

const ServiceListSkeleton = () => {
	return (
		<div className="grid grid-cols-12 gap-5">
			{Array(12)
				.fill(0)
				.map((_item, index) => {
					return (
						<div key={index} className="flex flex-col items-center gap-1 rounded-sm">
							<Skeleton className="w-20 h-20 aspect-square" />
							<Skeleton className="h-3 rounded-xl w-3/4" />
						</div>
					);
				})}
		</div>
	);
};

const ServiceListOverview = () => {
	const services = useSelector((state: RootState) => state.services.services);
	const dispatch = useDispatch<AppDispatch>();
	// disable fetch jika data sudah disimpan di redux
	const servicesQuery = useServicesQuery({ isEnable: !services.length });
	const servicesData = servicesQuery.data?.data as ServiceType[];
	const navigate = useNavigate();

	//menyimpan data ke redux kembali jika data di redux kosong
	useEffect(() => {
		if (servicesData?.length) dispatch(setServices(servicesData));
	}, [servicesData]);

	return (
		<>
			{servicesQuery.isLoading ? (
				<ServiceListSkeleton />
			) : (
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-12 gap-5">
					{services.map((item) => {
						return (
							<div
								key={item.service_name}
								onClick={() => navigate(`/purchase/${item.service_code}`)}
								className="flex flex-col items-center gap-1 cursor-pointer"
							>
								<img
									src={item.service_icon}
									alt={item.service_name}
									loading="lazy"
									className="w-20 h-20 aspect-square object-contain"
								/>
								<p className="text-center text-sm text-gray-500 font-medium">
									{item.service_name}
								</p>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
};

const ServiceList = () => {
	return (
		<ErrorBoundary
			fallback={
				<p className="text-gray-500 font-semibold w-full text-center">
					Gagal memuat data
				</p>
			}
		>
			<ServiceListOverview />
		</ErrorBoundary>
	);
};

export default ServiceList;

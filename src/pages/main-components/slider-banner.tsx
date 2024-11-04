import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect, useRef } from "react";

import { useBannerQuery } from "@/hooks/main-page.hook";
import { setBanner } from "@/store/slices/banner-slice";
import { AppDispatch, RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { BannerType } from "@/lib/types/banner";

const SliderBannerSkeleton = () => {
	return (
		<div className="w-full flex gap-7 overflow-hidden">
			{Array(4)
				.fill(0)
				.map(() => {
					return (
						<Skeleton className="rounded-xl object-cover w-[20rem] h-[8.5rem] " />
					);
				})}
		</div>
	);
};

const SliderBannerOverview = () => {
	const banner = useSelector((state: RootState) => state.banner.banner);
	const dispatch = useDispatch<AppDispatch>();
	//disable fetch jika data sudah disimpan di redux
	const bannerQuery = useBannerQuery({ isEnable: !banner.length });
	const bannersData = bannerQuery.data?.data as BannerType[];
	const contentRef = useRef<HTMLDivElement | null>(null);

	const scrollLeft = () => {
		if (contentRef.current) {
			contentRef.current.scrollTo({
				left: contentRef.current.scrollLeft - 400,
				behavior: "smooth",
			});
		}
	};

	const scrollRight = () => {
		if (contentRef.current) {
			contentRef.current.scrollTo({
				left: contentRef.current.scrollLeft + 400,
				behavior: "smooth",
			});
		}
	};

	//menyimpan data ke redux kembali jika data di redux kosong
	useEffect(() => {
		if (bannersData?.length) dispatch(setBanner(bannersData));
	}, [bannersData]);

	return (
		<>
			{bannerQuery.isLoading ? (
				<SliderBannerSkeleton />
			) : (
				<div className="group transition-all relative">
					<div
						onClick={scrollLeft}
						className="text-gray-500 p-2 rounded-full bg-white left-2 absolute opacity-0 group-hover:opacity-100 transition-all top-[3.3rem] cursor-pointer"
					>
						<ChevronLeft size={16} strokeWidth={3} />
					</div>
					<div
						onClick={scrollRight}
						className="text-gray-500 p-2 rounded-full bg-white right-2 absolute opacity-0 group-hover:opacity-100 transition-all top-[3.3rem] cursor-pointer"
					>
						<ChevronRight size={16} strokeWidth={3} />
					</div>
					<div className="w-full flex gap-7 overflow-hidden" ref={contentRef}>
						{banner.map((item) => {
							return (
								<img
									key={item.banner_name}
									src={item.banner_image}
									loading="lazy"
									className="rounded-xl object-cover w-[20rem] h-[8.5rem] "
								/>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
};

const SliderBanner = () => {
	return (
		<div className="flex flex-col gap-5">
			<p className="font-bold text-gray-600">Temukan promo menarik</p>
			<ErrorBoundary
				fallback={
					<p className="text-gray-500 font-semibold w-full text-center">
						Gagal memuat data
					</p>
				}
			>
				<SliderBannerOverview />
			</ErrorBoundary>
		</div>
	);
};

export default SliderBanner;

/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { ErrorBoundary } from "react-error-boundary";
import { useBalanceQuery } from "@/hooks/main-page.hook";
import { ClipLoader } from "react-spinners";
import { useEffect } from "react";

import { setBalance, setShowBalance } from "@/store/slices/balance-slice";
import BackgroundSaldo from "@/assets/Background Saldo.png";
import { ImageChecker } from "@/helper/image-checker";
import DummyProfile from "@/assets/Profile Photo.png";
import { Skeleton } from "../ui/skeleton";

const BalanceSkeleton = () => {
	return (
		<div className="w-full flex items-center">
			<Skeleton className="rounded-lg h-[2rem] w-[10rem]" />
		</div>
	);
};

const BalanceOverview = () => {
	const balance = useSelector((state: RootState) => state.balance.balance);
	const dispatch = useDispatch<AppDispatch>();

	const balanceQuery = useBalanceQuery({ isEnable: balance === null });
	const balanceData = balanceQuery.data?.balance;

	//menghindari fetch ulang
	useEffect(() => {
		if (balanceData !== null || balanceData !== undefined)
			dispatch(setBalance(balanceData));
	}, [balanceData]);

	return (
		<>
			{balanceQuery.isLoading ? (
				<BalanceSkeleton />
			) : (
				<span className="ml-2">{balance?.toLocaleString("id-ID")}</span>
			)}
		</>
	);
};

const HeaderLayout = () => {
	const user = useSelector((state: RootState) => state.user.user);
	const showBalance = useSelector(
		(state: RootState) => state.balance.showBalance
	);
	const dispatch = useDispatch<AppDispatch>();

	return (
		<div className="flex flex-col sm:flex-row justify-between sm:h-[11.5rem]">
			<div className="h-full flex flex-col items-center sm:items-start justify-between">
				<Avatar className="w-[5rem] h-[5rem] aspect-square">
					<AvatarImage
						src={ImageChecker(user.profile_image) ?? DummyProfile}
						alt="profile_image"
					/>
					<AvatarFallback>
						<ClipLoader />
					</AvatarFallback>
				</Avatar>
				<div>
					<h3 className="font-medium text-gray-600">Selamat datang,</h3>
					<h1 className="capitalize font-semibold text-center sm:text-start">
						{user.first_name + " " + user.last_name}
					</h1>
				</div>
			</div>
			<div
				className="w-full sm:w-[57.5%] bg-cover bg-no-repeat rounded-[1.3rem] py-8 px-6 text-white flex flex-col gap-[0.7rem]"
				style={{ backgroundImage: `url(${BackgroundSaldo})` }}
			>
				<p className="font-medium">Saldo anda</p>
				<h1 className="font-semibold flex gap-2  ">
					Rp
					{!showBalance ? (
						<div className="flex items-center gap-2">
							{Array(7)
								.fill(0)
								.map(() => {
									return (
										<div className="rounded-full bg-white w-3 h-3 aspect-square"></div>
									);
								})}
						</div>
					) : (
						<ErrorBoundary
							fallback={<p className="text-white font-semibold">Gagal memuat data</p>}
						>
							<BalanceOverview />
						</ErrorBoundary>
					)}
				</h1>
				<p
					className="text-sm font-medium cursor-pointer w-[7rem]"
					onClick={() => dispatch(setShowBalance(!showBalance))}
				>
					{showBalance ? "Tutup" : "Lihat"} Saldo
				</p>
			</div>
		</div>
	);
};

export default HeaderLayout;

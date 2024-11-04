import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { BeatLoader } from "react-spinners";
import { Minus, Plus } from "lucide-react";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { useMemo } from "react";

import { TransactionType } from "@/lib/types/transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { request } from "@/api/axios";
import { cn } from "@/lib/utils";

const fetchItems = async ({ pageParam = 0 }) => {
	const limit = 5; // Limit per page
	const response = await request.get(
		`transaction/history?offset=${pageParam}&limit=${limit}`
	);
	return response.data;
};

const ListTransactionOverview = () => {
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ["transaction"],
			queryFn: fetchItems,
			initialPageParam: 0,
			getNextPageParam: (lastPage) => {
				return lastPage.data.records.length === 5
					? Number(lastPage.data.offset) + 5
					: undefined;
			},
			refetchOnWindowFocus: false,
			placeholderData: keepPreviousData,
		});
	const flatData = useMemo(
		() =>
			(data?.pages?.flatMap((page) => page.data.records) as TransactionType[]) ??
			[],
		[data]
	);

	const dateFormatter = (date: string) => {
		return format(new Date(date), "dd MMMM yyyy", {
			locale: id,
		});
	};

	const timeFormatter = (date: string) => {
		return format(new Date(date), "HH:mm", {
			locale: id,
		});
	};

	return (
		<div className="space-y-5">
			{isLoading ? (
				Array(4)
					.fill(0)
					.map((_item, index) => {
						return <Skeleton key={index} className="h-16 rounded-xl" />;
					})
			) : !flatData.length ? (
				<p>Maaf tidak ada history transaksi pada saat ini</p>
			) : (
				flatData.map((item) => {
					return (
						<div
							key={item.invoice_number}
							className="p-5 py10 rounded-xl border border-gray-300 flex justify-between items-center"
						>
							<div className="space-y-2">
								<p
									className={cn(
										"font-bold text-xl opacity-80 flex items-center gap-2",
										item.transaction_type === "TOPUP" ? "text-[#52bd94]" : "text-primary"
									)}
								>
									{item.transaction_type === "TOPUP" ? (
										<Plus size={12} strokeWidth={3} />
									) : (
										<Minus size={12} strokeWidth={3} />
									)}
									Rp.{item.total_amount.toLocaleString("id-ID")}
								</p>
								<p className="text-xs text-gray-300 font-semibold">
									{dateFormatter(item.created_on)}{" "}
									<span className="ml-2">{timeFormatter(item.created_on)}</span>
								</p>
							</div>
							<p className="text-sm font-semibold text-gray-500">
								{item.transaction_type === "TOPUP" ? "Top Up Saldo" : item.description}
							</p>
						</div>
					);
				})
			)}
			{isFetchingNextPage ? (
				<div className="w-full flex justify-center">
					<BeatLoader size={12} color="#f42619" />
				</div>
			) : (
				hasNextPage &&
				!isLoading && (
					<p
						className="text-primary-dark font-semibold cursor-pointer text-center"
						onClick={() => fetchNextPage()}
					>
						Show more
					</p>
				)
			)}
		</div>
	);
};

const ListTransaction = () => {
	return (
		<ErrorBoundary
			fallback={
				<p className="text-gray-500 font-semibold w-full text-center">
					Gagal memuat data
				</p>
			}
		>
			<ListTransactionOverview />
		</ErrorBoundary>
	);
};

export default ListTransaction;

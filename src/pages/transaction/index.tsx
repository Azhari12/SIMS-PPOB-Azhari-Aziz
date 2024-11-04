import ListTransaction from "./components/list-transaction";
import HeaderLayout from "@/components/layouts/header";

const TransactionPage = () => {
	return (
		<section className="flex flex-col gap-[3rem]">
			<HeaderLayout />
			<div className="space-y-5">
				<h3 className="font-semibold  text-center sm:text-start">
					Semua Transaksi
				</h3>
				<ListTransaction />
			</div>
		</section>
	);
};

export default TransactionPage;

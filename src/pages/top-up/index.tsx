import HeaderLayout from "@/components/layouts/header";
import AmountForm from "./components/amount-form";

const TopUpPage = () => {
	return (
		<section className="flex flex-col gap-[3rem]">
			<HeaderLayout />
			<div>
				<h3 className="font-medium text-gray-600 text-center sm:text-start">
					Silahkan masukkan
				</h3>
				<h1 className="capitalize font-semibold text-center sm:text-start">
					Nominal Top Up
				</h1>
			</div>
			<AmountForm />
		</section>
	);
};
export default TopUpPage;

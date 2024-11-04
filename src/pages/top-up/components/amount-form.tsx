/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { Banknote } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import ResponseModal from "@/components/modal/response-modal";
import { useBalanceQuery } from "@/hooks/main-page.hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { request } from "@/api/axios";
import {
	formatCurrencyValue,
	formatToIndonesianCurrency,
} from "@/helper/currency-formatter";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
	amount: z
		.number()
		.min(1, "nominal tidak boleh kosong")
		.min(10000, "nominal tidak boleh kurang dari 10.000")
		.max(1000000, "nominal tidak boleh melebihi 1.000.000"),
});

const AmountForm = () => {
	const balanceQuery = useBalanceQuery({ isEnable: false });
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			amount: undefined,
		},
	});

	const { formState } = form;

	const [currencyValue, setCurrencyValue] = useState("");
	const [savedValue, setSavedValue] = useState<number>();
	const [modal, setModal] = useState(false);
	const [modalMode, setModalMode] = useState<
		"confirmation" | "success" | "fail" | ""
	>("");

	const quickAmount = [10000, 20000, 50000, 100000, 250000, 500000];

	const onSubmit = form.handleSubmit((data: z.infer<typeof FormSchema>) => {
		setModal(false);
		const payload = {
			top_up_amount: data.amount,
		};
		mutationTopUp.mutateAsync(payload);
	});

	const mutationTopUp = useMutation({
		mutationKey: [`topup`],
		async mutationFn(payload: { top_up_amount: number }) {
			const [apiPath] = this.mutationKey as [string];
			const getMethod = async () => {
				return await request.post(apiPath, payload);
			};
			const apiResponse = await getMethod();
			return apiResponse.data;
		},
		onError(error: any) {
			const { response } = error;
			toast.error(response.data.message);
			setModal(true);
			setModalMode("fail");
		},
		onSuccess(responseData) {
			toast.success(responseData.message);
			form.reset();
			setCurrencyValue("");
			balanceQuery.refetch();
			setModal(true);
			setModalMode("success");
		},
	});

	const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const formattedValue = formatToIndonesianCurrency(value);
		setCurrencyValue(String(formattedValue));
		form.setValue("amount", Number(formatCurrencyValue(value)));
		setSavedValue(Number(formatCurrencyValue(value)));
	};

	const handleQuickAmount = (amount: number) => {
		setCurrencyValue(amount.toLocaleString("id-ID"));
		form.setValue("amount", amount);
		setSavedValue(amount);
	};

	const handleModal = (type: "confirmation" | "success" | "fail" | "") => {
		setModal(true);
		setModalMode(type);
	};

	return (
		<div className="w-full flex flex-col md:flex-row gap-8">
			<Form {...form}>
				<div className="flex flex-col gap-3 w-full md:w-2/3">
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										{...field}
										type="text"
										placeholder="masukkan nominal Top Up"
										iconLeft={<Banknote size={14} />}
										filled={
											form.watch("amount") !== undefined &&
											!Number.isNaN(form.watch("amount"))
										}
										error={!!formState.errors.amount}
										value={currencyValue}
										onChange={(e) => {
											handleCurrencyChange(e);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						variant={!form.watch("amount") ? "disable" : "default"}
						disabled={!form.watch("amount")}
						className="mt-3"
						onClick={() => handleModal("confirmation")}
					>
						Top Up
					</Button>
				</div>
			</Form>
			<div className="grid grid-cols-3 gap-y-3 gap-x-2">
				{quickAmount.map((item) => {
					return (
						<div
							onClick={() => handleQuickAmount(item)}
							key={item}
							className="border rounded-lg p-3 text-sm font-medium flex justify-center items-center cursor-pointer hover:bg-slate-100"
						>
							Rp{item.toLocaleString("id-ID")}
						</div>
					);
				})}
			</div>

			<ResponseModal
				modal={modal}
				setModal={setModal}
				modalMode={modalMode}
				type="topup"
				currencyValue={savedValue ?? 0}
				onSubmit={onSubmit}
			/>
		</div>
	);
};

export default AmountForm;

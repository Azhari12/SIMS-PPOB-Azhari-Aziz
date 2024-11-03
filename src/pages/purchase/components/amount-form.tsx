/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/api/axios";
import ResponseModal from "@/components/modal/response-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBalanceQuery } from "@/hooks/main-page.hook";
import { ServiceType } from "@/lib/types/services";
import { RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { Banknote } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
	item?: ServiceType;
};

const AmountForm = ({ item }: Props) => {
	const balanceQuery = useBalanceQuery({ isEnable: false });

	const balance = useSelector((state: RootState) => state.balance.balance);

	const [error, setError] = useState("");
	const [modal, setModal] = useState(false);
	const [modalMode, setModalMode] = useState<
		"confirmation" | "success" | "fail" | ""
	>("");

	const onSubmit = () => {
		setModal(false);
		if (balance && item && balance < item?.service_tariff) {
			setError("Saldo anda tidak mencukupi untuk melakukan pembayaran ini");
			return;
		}
		const payload = {
			service_code: item?.service_code,
		};
		mutationPurchase.mutateAsync(payload);
	};

	const mutationPurchase = useMutation({
		mutationKey: [`transaction`],
		async mutationFn(payload: { service_code?: string }) {
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
			balanceQuery.refetch();
			setModal(true);
			setModalMode("success");
		},
	});

	const handleModal = (type: "confirmation" | "success" | "fail" | "") => {
		setModal(true);
		setModalMode(type);
	};

	return (
		<>
			<div className="flex flex-col gap-3 w-full">
				<div>
					<Input
						type="text"
						placeholder="masukkan nominal Top Up"
						iconLeft={<Banknote size={14} />}
						filled={item?.service_tariff !== undefined}
						error={error !== ""}
						value={item?.service_tariff.toLocaleString("id-ID")}
					/>
					<p className="text-sm text-right text-primary">{error}</p>
				</div>
				<Button
					variant={item?.service_tariff === undefined ? "disable" : "default"}
					disabled={item?.service_tariff === undefined}
					className="mt-3"
					onClick={() => handleModal("confirmation")}
				>
					Bayar
				</Button>
			</div>
			<ResponseModal
				modal={modal}
				setModal={setModal}
				modalMode={modalMode}
				type="purchase"
				currencyValue={item?.service_tariff ?? 0}
				onSubmit={onSubmit}
				purchaseName={item?.service_name}
			/>
		</>
	);
};

export default AmountForm;

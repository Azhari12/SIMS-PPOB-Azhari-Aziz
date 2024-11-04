/* eslint-disable @typescript-eslint/no-explicit-any */
import { DialogDescription } from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import logo from "@/assets/Logo.png";
import { cn } from "@/lib/utils";

type Props = {
	modal: boolean;
	setModal: any;
	modalMode: "confirmation" | "success" | "fail" | "";
	type: "purchase" | "topup";
	currencyValue: number;
	onSubmit: () => void;
	purchaseName?: string;
};

const ResponseModal = (props: Props) => {
	const {
		modal,
		setModal,
		modalMode,
		currencyValue,
		onSubmit,
		type,
		purchaseName,
	} = props;

	const navigate = useNavigate();

	return (
		<Dialog open={modal} onOpenChange={setModal}>
			<DialogHeader>
				<DialogTitle></DialogTitle>
				<DialogDescription></DialogDescription>
			</DialogHeader>
			<DialogContent className="w-[20rem] flex flex-col justify-center items-center gap-5">
				{modalMode === "confirmation" ? (
					<img src={logo} alt="logo" className="w-14 h-14 aspect-square" />
				) : (
					<div
						className={cn(
							"p-4 rounded-full",
							modalMode === "success" ? "bg-[#52bd94]" : "bg-primary"
						)}
					>
						{modalMode === "success" ? (
							<Check size={20} color="white" strokeWidth={3} />
						) : (
							<X size={20} color="white" strokeWidth={3} />
						)}
					</div>
				)}

				<div className="space-y-1 text-center">
					<p>
						{modalMode === "confirmation"
							? type === "topup"
								? "Anda yakin Top Up sebesar"
								: `Beli ${purchaseName} senilai`
							: type === "topup"
							? "Top Up sebesar"
							: `Pembayaran ${purchaseName} sebesar`}
					</p>
					<h4 className="font-bold">
						Rp{currencyValue.toLocaleString("id-ID")}{" "}
						{modalMode === "confirmation" && " ?"}
					</h4>
					{modalMode === "success" ? (
						<p>berhasil!</p>
					) : modalMode === "fail" ? (
						<p>gagal!</p>
					) : null}
				</div>
				<p
					onClick={() => {
						if (modalMode === "confirmation") onSubmit();
						else navigate("/");
					}}
					className="mt-3 text-primary font-semibold hover:bg-primary-foreground p-2 rounded-xl cursor-pointer"
				>
					{modalMode === "confirmation"
						? type === "topup"
							? "Ya, lanjutkan Top Up"
							: "Ya, lanjutkan bayar"
						: "Kembali ke Beranda"}
				</p>
				{modalMode === "confirmation" && (
					<p
						className="font-semibold text-gray-400 cursor-pointer"
						onClick={() => setModal(false)}
					>
						Batalkan
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default ResponseModal;

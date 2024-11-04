/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Cookies } from "react-cookie";
import { toast } from "sonner";

import { setUser } from "@/store/slices/user-slice";
import { UserType } from "@/lib/types/user";
import { AppDispatch } from "@/store/store";
import { request } from "@/api/axios";

export const useClientLogout = () => {
	const navigate = useNavigate();
	const logout = useCallback(() => {
		const cookies = new Cookies();
		cookies.remove("ppobAccessToken", { path: "/" });
		navigate("/login");
	}, []);

	return logout;
};

export const useProfileSuspenseQuery = () => {
	const logout = useClientLogout();
	const dispatch = useDispatch<AppDispatch>();
	const profileQuery = useSuspenseQuery({
		queryKey: ["profile"] as const,
		async queryFn({ queryKey }) {
			const [apiPath] = queryKey;
			try {
				const data = (await request.get(apiPath))?.data;
				return data.data as UserType;
			} catch (error: any) {
				return null;
			}
		},
		refetchOnWindowFocus: false,
	});

	// berguna untuk check bahwa apakah user masih memiliki akses terhadap private api dengan me hit profile api
	// jika tidak memiliki akses user dipaksa untuk logout
	useEffect(
		() => {
			if (profileQuery.data) {
				dispatch(setUser(profileQuery.data));
			} else {
				toast.error(
					"Gagal memuat data, mohon coba untuk login kembali dalam beberapa saat"
				);
				logout();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[profileQuery.data]
	);

	return profileQuery;
};

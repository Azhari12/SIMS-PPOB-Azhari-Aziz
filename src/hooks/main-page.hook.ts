import { request } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

type Option = {
	isEnable: boolean;
};

export const useServicesQuery = (option: Option) => {
	return useQuery({
		queryKey: ["services"] as const,
		queryFn: async ({ queryKey }) => {
			const [apiPath] = queryKey;
			const response = await request(apiPath);
			return response.data;
		},
		refetchOnWindowFocus: false,
		enabled: option.isEnable,
	});
};

export const useBannerQuery = (option: Option) => {
	return useQuery({
		queryKey: ["banner"] as const,
		queryFn: async ({ queryKey }) => {
			const [apiPath] = queryKey;
			const response = await request(apiPath);
			return response.data;
		},
		refetchOnWindowFocus: false,
		enabled: option.isEnable,
	});
};

export const useBalanceQuery = (option: Option) => {
	return useQuery({
		queryKey: ["balance"] as const,
		queryFn: async ({ queryKey }) => {
			const [apiPath] = queryKey;
			const response = await request(apiPath);
			return response.data.data;
		},
		refetchOnWindowFocus: false,
		enabled: option.isEnable,
	});
};

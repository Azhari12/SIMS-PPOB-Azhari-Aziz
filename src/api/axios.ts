import { Cookies } from "react-cookie";
import axios from "axios";

import { getAccessToken } from "@/auth";

export const request = axios.create({
	baseURL: "https://take-home-test-api.nutech-integrasi.com",
	timeout: 100000,
});

request.interceptors.request.use(
	(config) => {
		const token = getAccessToken();

		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
			config.headers["Accept-Language"] = "application/json";
		}
		return config;
	},
	function (error) {
		//handler jika JWT sudah expire sehingga mendapatkan response 401 Unauthorized
		if (error.response && error.response.status === 401) {
			const pathname = window.location.href.split("//");
			const currentURL = pathname[1];
			if (currentURL.split("/")[1] !== "login") {
				const cookies = new Cookies();
				cookies.remove("ppobAccessToken", { path: "/" });
				window.location.href = "/";
			}
		}
		return error;
	}
);

request.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		//handler jika JWT sudah expire sehingga mendapatkan response 401 Unauthorized
		if (error.response && error.response.status === 401) {
			const pathname = window.location.href.split("//");
			const currentURL = pathname[1];
			if (currentURL.split("/")[1] !== "login") {
				const cookies = new Cookies();
				cookies.remove("ppobAccessToken", { path: "/" });
				window.location.href = "/";
			}
		}

		return Promise.reject(error);
	}
);

import { getAccessToken } from "@/auth";
import axios from "axios";
import { Cookies } from "react-cookie";

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
		if (error.response.status === 401) {
			// window.location.reload();
		}
		return error;
	}
);

request.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
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

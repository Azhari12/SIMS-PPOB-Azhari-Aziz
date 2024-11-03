import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const getAccessToken = () => {
	const token = cookies.get("ppobAccessToken");
	return token;
};

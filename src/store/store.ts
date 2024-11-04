import { configureStore } from "@reduxjs/toolkit";

import serviceSlice from "./slices/services-slice";
import balanceSlice from "./slices/balance-slice";
import bannerSlice from "./slices/banner-slice";
import userSlice from "./slices/user-slice";

export const store = configureStore({
	reducer: {
		user: userSlice,
		balance: balanceSlice,
		services: serviceSlice,
		banner: bannerSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BalanceState {
	showBalance: boolean;
	balance: number | null;
}

const initialState: BalanceState = {
	showBalance: false,
	balance: null,
};

const balanceSlice = createSlice({
	name: "balanceSlice",
	initialState,
	reducers: {
		setShowBalance: (state, action: PayloadAction<boolean>) => {
			state.showBalance = action.payload;
		},
		setBalance: (state, action: PayloadAction<number | null>) => {
			state.balance = action.payload;
		},
	},
});

export const { setShowBalance } = balanceSlice.actions;
export const { setBalance } = balanceSlice.actions;

export default balanceSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BannerType } from "@/lib/types/banner";

interface BannerState {
	banner: BannerType[];
}

const initialState: BannerState = {
	banner: [],
};

const bannerSlice = createSlice({
	name: "banner",
	initialState,
	reducers: {
		setBanner: (state, action: PayloadAction<BannerType[]>) => {
			state.banner = action.payload;
		},
	},
});

export const { setBanner } = bannerSlice.actions;

export default bannerSlice.reducer;

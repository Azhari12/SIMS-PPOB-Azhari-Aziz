import { BannerType } from "@/lib/types/banner";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

// Action creators are generated for each case reducer function
export const { setBanner } = bannerSlice.actions;

export default bannerSlice.reducer;

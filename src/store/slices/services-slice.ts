import { ServiceType } from "@/lib/types/services";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServicesState {
	services: ServiceType[];
}

const initialState: ServicesState = {
	services: [],
};

const servicesSlice = createSlice({
	name: "services",
	initialState,
	reducers: {
		setServices: (state, action: PayloadAction<ServiceType[]>) => {
			state.services = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setServices } = servicesSlice.actions;

export default servicesSlice.reducer;

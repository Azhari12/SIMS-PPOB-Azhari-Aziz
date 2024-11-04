import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "@/lib/types/user";

interface UserState {
	user: UserType;
}

const initialState: UserState = {
	user: {
		email: "",
		first_name: "",
		last_name: "",
		profile_image: "",
	},
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<UserType>) => {
			state.user = action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;

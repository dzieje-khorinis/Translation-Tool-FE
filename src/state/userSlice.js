import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: !!localStorage.getItem('token'),
    loggedIn: false,
    isTranslator: true,
    languageCode: 'en',
  },
  reducers: {
    login: (state) => {
      /* eslint-disable-next-line no-param-reassign */
      state.loggedIn = true;
    },
    logout: (state) => {
      /* eslint-disable-next-line no-param-reassign */
      state.loggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

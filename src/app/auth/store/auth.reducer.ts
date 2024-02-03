import {User} from "../../model/user.model";
import {createReducer, on} from "@ngrx/store";
import {authenticateSuccess, authenticateFail, loginStart, logout, signupStart, clearError} from "./auth.action";

export interface State {
  user: User;
  authError: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
}

export const authReducer = createReducer(
  initialState,
  on(authenticateSuccess, (state, action) => {
    const user: User = new User(action.email, action.id, action.token, action.tokenExpirationDate);

    return {
      ...state,
      user: user,
      loading: false,
      authError: null
    }
  }),
  on(loginStart, signupStart, (state, action) => {
    return {
      ...state,
      authError: null,
      loading: true
    }
  }),
  on(authenticateFail, (state, action) => {
    return {
      ...state,
      user: null,
      authError: action.message,
      loading: false
    }
  }),
  on(logout, (state, action) => ({
    ...state,
    user: null
  })),
  on(clearError, (state, action) => ({
    ...state,
    authError: null
  })),
);

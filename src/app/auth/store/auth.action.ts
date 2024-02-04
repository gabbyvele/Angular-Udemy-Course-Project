import {createAction, props} from "@ngrx/store";

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{ email: string; password: string }>()
);

export const authenticateSuccess = createAction(
  '[Auth] Success',
  props<{
    email: string;
    id: string;
    token: string;
    tokenExpirationDate: Date;
    redirect: boolean
  }>()
);

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string; password: string }>()
);

export const autoLogin = createAction(
  '[Auth] Auto Login'
);

export const authenticateFail = createAction(
  '[Auth] Fail',
  props<{ message: string }>()
);

export const logout = createAction(
  '[Auth] Logout'
);

export const clearError = createAction(
  '[Auth] Clear Error'
);

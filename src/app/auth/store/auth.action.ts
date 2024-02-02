import {createAction, props} from "@ngrx/store";

export const login = createAction(
  '[Auth] Login',
  props<{
    email: string;
    id: string;
    token: string;
    tokenExpirationDate: Date
  }>()
);

export const logout = createAction(
  '[Auth] Logout'
);

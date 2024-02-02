import {User} from "../../model/user.model";
import {createReducer, on} from "@ngrx/store";
import {addIngredient} from "../../shopping-list/store/shopping-list.actions";
import {login, logout} from "./auth.action";

export interface State {
  user: User;
}

const initialState: State = {
  user: null
}

export const authReducer = createReducer(
  initialState,
  on(login, (state, action) => {
    const user: User = new User(action.email, action.id, action.token, action.tokenExpirationDate);

    return {
      ...state,
      user: user
    }
  }),
  on(logout, (state, action) => ({
    ...state,
    user: null
  })),
);

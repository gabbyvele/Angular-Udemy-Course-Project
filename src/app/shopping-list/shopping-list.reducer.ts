import {createAction, createReducer, on, props} from "@ngrx/store";
import {Ingredient} from "../model/ingredient.model";
import {state} from "@angular/animations";

export const addIngredient = createAction(
  '[Counter] Increment',
  props<{ value: Ingredient }>()
);

const initialState = {
  ingredients: [
    new Ingredient('Apples', 50),
    new Ingredient('Spice', 80)]
};

export const shoppingListReducer = createReducer(
  initialState,
  on(addIngredient, (state, action) => {
    return {
      ...state,
      ingredients: [...state.ingredients, initialState]
    };
  })
);

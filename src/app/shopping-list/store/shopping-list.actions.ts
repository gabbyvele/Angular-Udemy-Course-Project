import {createAction, props} from "@ngrx/store";
import {Ingredient} from "../../model/ingredient.model";

export const addIngredient = createAction(
  '[Ingredient] Add',
  props<{ ingredient: Ingredient }>()
);

export const addIngredients = createAction(
  '[Ingredient] Add Multiple',
  props<{ ingredients: Ingredient[] }>()
)

export const updateIngredient = createAction(
  '[Ingredient] Update',
  props<{ ingredient: Ingredient }>()
)

export const deleteIngredient = createAction(
  '[Ingredient] Delete'
)

export const startEdit = createAction(
  '[Ingredient] Start Edit',
  props<{ index: number }>()
)

export const stopEdit = createAction(
  '[Ingredient] Stop Edit'
)

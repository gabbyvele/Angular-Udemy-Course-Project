import {createReducer, on} from "@ngrx/store";
import {Ingredient} from "../../model/ingredient.model";
import {
  addIngredient,
  addIngredients,
  deleteIngredient,
  startEdit,
  stopEdit,
  updateIngredient
} from "./shopping-list.actions";
import {ShoppingListService} from "../shopping-list.service";

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export interface AppState {
  shoppingList: State
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 50),
    new Ingredient('Spice', 80)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export const shoppingListReducer = createReducer(
  initialState,
  on(addIngredient, (state, action) => ({
    ...state, // call the current state
    ingredients: [...state.ingredients, action.ingredient]
  })),

  on(addIngredients, (state, action) => ({
    ...state, // call the current state
    ingredients: [...state.ingredients, ...action.ingredients]
  })),

  on(updateIngredient, (state, action) => {
    const ingredient = state.ingredients[state.editedIngredientIndex];
    // This copies the old ingredient and overwrites it with a new ingredient, so overwrites the properties
    const updatedIngredient = {
      ...ingredient,
      ...action.ingredient
    };

    const updatedIngredients = [...state.ingredients];
    updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
    return {
      ...state, // call the current state
      ingredients: updatedIngredients,
      editedIngredientIndex: -1,
      editedIngredient: null
    };
  }),

  on(deleteIngredient, (state, action) => ({
    ...state, // call the current state
    ingredients: state.ingredients.filter((ig, igIndex) => {
      return igIndex !== state.editedIngredientIndex;
    })
  })),

  on(startEdit, (state, action) => ({
    ...state, // call the current state
    editedIngredientIndex: action.index,
    editedIngredient: {...state.ingredients[action.index]}
  })),

  on(stopEdit, (state, action) => ({
    ...state, // call the current state
    editedIngredientIndex: -1,
    editedIngredient: null
  })),
);

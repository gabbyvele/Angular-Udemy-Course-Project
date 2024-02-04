import {Recipe} from "../../model/recipe.model";
import {createReducer, on} from "@ngrx/store";
import {addRecipe, deleteRecipe, setRecipes, storeRecipes, updateRecipe} from "./recipe.actions";
import {authenticateSuccess} from "../../auth/store/auth.action";

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
}

export const recipeReducer = createReducer(
  initialState,
  on(setRecipes, (state, action) => ({
      ...state,
      recipes: [...action.recipes]
    })
  ),
  on(addRecipe, (state, action) => ({
      ...state,
      recipes: [...state.recipes, action.recipe]
    })
  ),
  on(updateRecipe, (state, action) => {
    const updatedRecipe = {
      ...state.recipes[action.index],
      ...action.recipe
    };

    const updatedRecipes = [...state.recipes];
    updatedRecipes[action.index] = updatedRecipe;

    return {
      ...state,
      recipes: [...updatedRecipes]
    }
  }),
  on(deleteRecipe, (state, action) => ({
      ...state,
      recipes: state.recipes.filter((recipe, index) => {
        return index !== action.index;
      })
    })
  )
)


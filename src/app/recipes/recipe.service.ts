import {Recipe} from "../model/recipe.model";
import {EventEmitter, Injectable} from "@angular/core";
import {Ingredient} from "../model/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe [] = [
    new Recipe(
      "Pap",
      "How to make Pap",
      "https://www.unileverfoodsolutions.co.za/dam/global-ufs/mcos/SOUTH-AFRICA/calcmenu/recipes/ZA-recipes/refresh-deli-q1/stiff-pap-main-header.jpg",
      [
        new Ingredient("Maize", 1),
        new Ingredient("Water", 1)
      ])
  ];

  constructor(private slService: ShoppingListService) {
  }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  addToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}

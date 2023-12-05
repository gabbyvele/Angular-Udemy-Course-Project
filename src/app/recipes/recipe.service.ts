import {Recipe} from "../model/recipe.model";
import {Injectable} from "@angular/core";
import {Ingredient} from "../model/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable()
export class RecipeService {
    recipeSelected = new Subject<Recipe>();
    recipeChanged = new Subject<Recipe[]>();

    // private recipes: Recipe [] = [
    //     new Recipe(
    //         "Pap",
    //         "How to make Pap",
    //         "https://www.unileverfoodsolutions.co.za/dam/global-ufs/mcos/SOUTH-AFRICA/calcmenu/recipes/ZA-recipes/refresh-deli-q1/stiff-pap-main-header.jpg",
    //         [
    //             new Ingredient("Maize", 1),
    //             new Ingredient("Water", 1)
    //         ]),
    //     new Recipe(
    //         "Rice",
    //         "How to make Rice",
    //         "https://cdn12.picryl.com/photo/2016/12/31/rice-ball-food-diet-food-drink-f9306f-1024.jpg",
    //         [
    //             new Ingredient("Rice", 1),
    //             new Ingredient("Water", 1),
    //             new Ingredient("Salt", 1)
    //         ]),
    // ];
    private recipes: Recipe [] = [];

    constructor(private slService: ShoppingListService) {
    }

    getRecipes(): Recipe[] {
        return this.recipes.slice();
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
    }

    addToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    getRecipeById(id: number) {
        return this.recipes.slice()[id];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }

    updateRecipe(id, to: Recipe) {
        this.recipes[id] = to;
        this.recipeChanged.next(this.recipes.slice());
    }

    deleteRecipe(id: number) {
        this.recipes.splice(id, 1);
        this.recipeChanged.next(this.recipes.slice());
    }
}

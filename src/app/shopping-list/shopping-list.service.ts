import {Ingredient} from "../model/ingredient.model";
import {Subject} from "rxjs";

export class ShoppingListService {

    ingredientsChanged = new Subject<Ingredient[]>();
    editStarted = new Subject<number>();

    private ingredients: Ingredient [] = [
        new Ingredient('Apples', 50),
        new Ingredient('Spice', 80)
    ];

    getIngredients() {
        return this.ingredients.slice();
    }

    getIngredientById(id: number) {
        return this.ingredients.slice()[id];
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngredient(id: number, to : Ingredient) {
        this.ingredients[id] = to;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(id:number){
        this.ingredients.splice(id, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}

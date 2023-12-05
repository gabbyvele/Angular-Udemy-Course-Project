import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../model/recipe.model";
import {map, tap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(private httpClient: HttpClient, private recipeService: RecipeService) {
    }

    saveRecipes() {
        const recipes = this.recipeService.getRecipes();
        return this.httpClient
            .put('https://ng-gyv-course-recipe-book-default-rtdb.firebaseio.com/recipes.json', recipes)
            .subscribe(response => {
                console.log(response)
            })
    }

    getRecipes() {
        return this.httpClient
            .get<Recipe[]>('https://ng-gyv-course-recipe-book-default-rtdb.firebaseio.com/recipes.json')
            .pipe(map(recipes => {
                    return recipes.map(recipe => {
                        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
                    });
                }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                })
            );
    }
}

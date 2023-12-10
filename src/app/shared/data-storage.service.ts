import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../model/recipe.model";
import {exhaustMap, map, take, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {

    private saveUrl = 'https://ng-gyv-course-recipe-book-default-rtdb.firebaseio.com/recipes.json';
    private getUrl = 'https://ng-gyv-course-recipe-book-default-rtdb.firebaseio.com/recipes.json';

    constructor(private httpClient: HttpClient,
                private recipeService: RecipeService,
                private authService: AuthService) {
    }

    saveRecipes() {
        const recipes = this.recipeService.getRecipes();
        return this.httpClient
            .put(this.saveUrl, recipes)
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

import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {from, switchMap, withLatestFrom} from "rxjs";
import {fetchRecipes, setRecipes} from "./recipe.actions";
import {Recipe} from "../../model/recipe.model";
import {map, tap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class RecipesEffect {

  private actions$ = inject(Actions);
  private store: Store<AppState> = inject(Store);
  private httpClient = inject(HttpClient);

  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchRecipes),
      switchMap(() => {
        return this.httpClient
          .get<Recipe[]>('https://ng-gyv-course-recipe-book-default-rtdb.firebaseio.com/recipes.json')
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      map(recipes => {
        return setRecipes({recipes});
      }),
    )
  );

  storeRecipes = createEffect(() =>
      this.actions$.pipe(
        ofType(fetchRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
          return this.httpClient
            .put<Recipe[]>(
              'https://ng-gyv-course-recipe-book-default-rtdb.firebaseio.com/recipes.json',
              recipesState.recipes
            );
        })),
    {dispatch: false});
}




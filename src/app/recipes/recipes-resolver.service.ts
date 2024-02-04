import {inject, Injectable} from "@angular/core";
import {Recipe} from "../model/recipe.model";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import {fetchRecipes, setRecipes} from "./store/recipe.actions";
import {Actions, ofType} from "@ngrx/effects";
import {first, map, switchMap, take} from "rxjs/operators";
import {of} from "rxjs";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {

  private store: Store<AppState> = inject(Store);
  private actions$ = inject(Actions);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    this.store.select('recipes').pipe(
      first(),
      map(recipesState => {
          return recipesState.recipes;
        }
      ),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(fetchRecipes());
          return this.actions$.pipe(
            ofType(setRecipes),
            first()
          );
        } else {
          return of(recipes);
        }
      })
    );
  }
}

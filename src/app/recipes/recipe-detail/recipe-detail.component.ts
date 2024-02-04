import {Component, inject, OnInit} from '@angular/core';
import {Recipe} from "../../model/recipe.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {map, switchMap} from "rxjs/operators";
import {deleteRecipe, updateRecipe} from "../store/recipe.actions";
import {addIngredients} from "../../shopping-list/store/shopping-list.actions";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  id: number;
  recipe: Recipe;
  private store: Store<AppState> = inject(Store);

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map(params => {
          return +params['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipeStore => {
          return recipeStore.recipes.find((recipe, index) => {
            return this.id === index;
          });
        }))
      .subscribe(recipe => {
        this.recipe = recipe;
      });
  }

  onAddToShoppingList() {
    this.store.dispatch(addIngredients({ingredients: this.recipe.ingredients}));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

  onDeleteRecipe() {
    this.store.dispatch(deleteRecipe({index: this.id}));

    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }
}

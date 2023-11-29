import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../model/recipe.model";
import {RecipeService} from "./recipe.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-recipes',
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit, OnDestroy {
    selectedRecipe: Recipe;
    private recipeSelectedSubscription: Subscription;

    constructor(private recipeService: RecipeService) {

    }

    ngOnInit(): void {
        this.recipeSelectedSubscription = this.recipeService.recipeSelected.subscribe((recipe: Recipe) => {
            this.selectedRecipe = recipe;
        });
    }

    ngOnDestroy(): void {
        this.recipeSelectedSubscription.unsubscribe();
    }

}

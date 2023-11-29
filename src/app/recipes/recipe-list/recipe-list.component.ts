import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../../model/recipe.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

    recipes: Recipe [];
    recipeChangedSubscription: Subscription;

    constructor(private recipeService: RecipeService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.recipeChangedSubscription = this.recipeService.recipeChanged.subscribe((recipes: Recipe[]) => {
            this.recipes = recipes;
        })
        this.recipes = this.recipeService.getRecipes();
    }

    ngOnDestroy(): void {
        this.recipeChangedSubscription.unsubscribe();
    }

    onNewRecipe() {
        this.router.navigate(['new'], {relativeTo: this.activatedRoute})
    }
}

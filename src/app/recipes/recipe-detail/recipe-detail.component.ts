import {Component, OnInit} from '@angular/core';
import {Recipe} from "../../model/recipe.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
    id: number;
    recipe: Recipe;

    constructor(private recipeService: RecipeService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.activatedRoute.params
            .subscribe(
                (params: Params) => {
                    this.id = params['id'];
                    this.recipe = this.recipeService.getRecipeById(this.id);
                });
    }

    onAddToShoppingList() {
        this.recipeService.addToShoppingList(this.recipe.ingredients)
    }

    onEditRecipe() {
        this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
    }

    onDeleteRecipe() {
        this.recipeService.deleteRecipe(this.id);
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    }
}

import {Component, OnInit} from '@angular/core';
import {Recipe} from "../../model/recipe.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

    id: number;
    recipe: Recipe;
    isEdit : boolean = false;

    constructor(private recipeService: RecipeService,
                private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        this.route.params
            .subscribe(
                (params: Params) => {
                    this.id = params['id'];
                    this.isEdit = params['id'];
                    this.recipe = this.recipeService.getRecipeById(this.id);
                });
    }

}

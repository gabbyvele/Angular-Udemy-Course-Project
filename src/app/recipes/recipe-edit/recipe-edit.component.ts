import {Component, OnInit} from '@angular/core';
import {Recipe} from "../../model/recipe.model";
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

    id: number;
    recipe: Recipe;
    isEdit: boolean = false;
    recipeForm: FormGroup;

    constructor(private recipeService: RecipeService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    get controls() {
        return (<FormArray>this.recipeForm.get('ingredients')).controls;
    }

    ngOnInit(): void {
        this.activatedRoute.params
            .subscribe(
                (params: Params) => {
                    this.id = params['id'];
                    this.isEdit = params['id'] != null;
                    this.recipe = this.recipeService.getRecipeById(this.id);
                    this.initForm();
                });
    }

    onSubmit() {
        // const recipe = new Recipe(
        //     this.recipeForm.value['name'],
        //     this.recipeForm.value['description'],
        //     this.recipeForm.value['imagePath'],
        //     this.recipeForm.value['ingredients'],
        //     );
        if (this.isEdit) {
            this.recipeService.updateRecipe(this.id, this.recipeForm.value);
        } else {
            this.recipeService.addRecipe(this.recipeForm.value)
        }

        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    }

    onAddIngredient() {
        (<FormArray>this.recipeForm.get('ingredients')).push(
            new FormGroup({
                'name': new FormControl(),
                'amount': new FormControl()
            })
        );
    }

    onCancel() {
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    }

    private initForm() {
        let recipeName = '';
        let recipeImagePath = '';
        let recipeDescription = '';
        let recipeIngredients = new FormArray([]);

        if (this.isEdit) {
            const recipe = this.recipeService.getRecipeById(this.id);
            recipeName = recipe.name;
            recipeImagePath = recipe.imagePath;
            recipeDescription = recipe.description;
            if (recipe['ingredients']) {
                for (let ingredient of recipe.ingredients) {
                    recipeIngredients.push(
                        new FormGroup({
                            'name': new FormControl(ingredient.name, Validators.required),
                            'amount': new FormControl(ingredient.amount, [
                                Validators.required,
                                Validators.pattern(/^[1-9]+[0-9]*$/)
                            ])
                        })
                    )
                }
            }
        }

        this.recipeForm = new FormGroup({
            'name': new FormControl(recipeName, Validators.required),
            'imagePath': new FormControl(recipeImagePath, Validators.required),
            'description': new FormControl(recipeDescription, Validators.required),
            'ingredients': recipeIngredients
        });
    }

    onDeleteIngredient(id: number) {
        (<FormArray>this.recipeForm.get('ingredients')).removeAt(id);
    }

    onClearAll() {
        (<FormArray>this.recipeForm.get('ingredients')).clear();
    }
}

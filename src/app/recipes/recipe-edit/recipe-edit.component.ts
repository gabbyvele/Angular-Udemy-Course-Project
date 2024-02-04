import {Component, inject, Inject, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../../model/recipe.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {map} from "rxjs/operators";
import {addRecipe, updateRecipe} from "../store/recipe.actions";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number;
  recipe: Recipe;
  isEdit: boolean = false;
  recipeForm: FormGroup;
  private store: Store<AppState> = inject(Store);
  private storeSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.isEdit = params['id'] != null;
          this.initForm();
        });
  }

  onSubmit() {
    if (this.isEdit) {
      this.store.dispatch(updateRecipe({index: this.id, recipe: this.recipeForm.value}));
    } else {
      this.store.dispatch(addRecipe({recipe: this.recipeForm.value}));
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
      this.storeSub = this.store.select('recipes')
        .pipe(
          map(recipeState => {
            console.log("!!!!!! >" + this.id);
            return recipeState.recipes.find((recipe, index) => {
              console.log(index);
              console.log(index === this.id);
              return index === this.id;
            });
          })
        )
        .subscribe(recipe => {
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
        });
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

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}

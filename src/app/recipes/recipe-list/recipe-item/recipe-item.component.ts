import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Recipe} from "../../../model/recipe.model";
import {RecipeService} from "../../recipe.service";

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {

  recipe: Recipe
  @Input() id : number;

  constructor(private recipeService : RecipeService) {

  }

  ngOnInit(): void {
    this.recipe = this.recipeService.getRecipeById(this.id);
  }
}

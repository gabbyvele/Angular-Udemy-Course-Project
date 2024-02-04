import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Recipe} from "../../../model/recipe.model";
import {RecipeService} from "../../recipe.service";
import {Store} from "@ngrx/store";
import {AppState} from "../../../store/app.reducer";

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {

  @Input() recipe: Recipe
  @Input() id: number;

  constructor(private recipeService: RecipeService) {
  }

  ngOnInit(): void {
  }
}

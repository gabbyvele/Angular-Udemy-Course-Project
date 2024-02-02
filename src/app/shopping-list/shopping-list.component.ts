import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from "../model/ingredient.model";
import {Observable, Subscription} from "rxjs";
import {LoggingService} from "../logging.service";
import {Store} from "@ngrx/store";
import {startEdit} from "./store/shopping-list.actions";
import {AppState} from "../store/app.reducer";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // ingredients: Ingredient [];
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // private ingredientsChangeSubscription: Subscription;
  private store: Store<AppState> = inject(Store);

  constructor(private loggingService: LoggingService) {
  }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    this.loggingService.printLog('Shopping list initialised: ');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.ingredientsChangeSubscription = this.shoppingListService.ingredientsChanged
    //   .subscribe((ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   });
  }


  onEditItem(id: number) {
    this.store.dispatch(startEdit({index: id}))
  }

  ngOnDestroy(): void {
    // this.ingredientsChangeSubscription.unsubscribe();
  }
}

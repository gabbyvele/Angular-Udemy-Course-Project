import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../model/ingredient.model";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {addIngredient, deleteIngredient, stopEdit, updateIngredient} from "../store/shopping-list.actions";
import {AppState} from "../../store/app.reducer";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f') shoppingListForm: NgForm;
  editStartedSubscription: Subscription;
  editMode: boolean = false;
  editItem: Ingredient;
  private store: Store<AppState> = inject(Store);

  ngOnInit(): void {
    this.editStartedSubscription = this.store.select('shoppingList')
      .subscribe((stateData) => {
        console.log(stateData.editedIngredientIndex);
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editItem = stateData.editedIngredient;
          this.shoppingListForm.setValue({
            name: this.editItem.name,
            amount: this.editItem.amount
          })
        } else {
          this.editMode = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.editStartedSubscription.unsubscribe();
    // this.editMode = false;
    // this.editModeId = -1;
    this.store.dispatch(stopEdit());
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const ingredient = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      // this.shoppingListService.updateIngredient(this.editModeId, ingredient);
      this.store.dispatch(updateIngredient({ingredient}));
    } else {
      // this.shoppingListService.addIngredient(ingredient);
      // Dispatch when adding
      this.store.dispatch(addIngredient({ingredient}));
    }

    this.shoppingListForm.reset();
    // this.editMode = false;
    // this.editModeId = -1;
    this.store.dispatch(stopEdit());
  }

  onDeleteItem() {
    console.log("!!!!! IN DELETE");
    // this.shoppingListService.deleteIngredient(this.editModeId);
    this.store.dispatch(deleteIngredient());
    this.onClearItem();
  }

  onClearItem() {
    this.shoppingListForm.reset();
    this.store.dispatch(stopEdit());
  }
}

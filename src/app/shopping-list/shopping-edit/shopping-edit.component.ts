import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../model/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

    @ViewChild('f') shoppingListForm: NgForm;
    editStartedSubscription: Subscription;
    editMode: boolean = false;
    editModeId: number = -1;
    editItem: Ingredient;

    constructor(private shoppingListService: ShoppingListService) {
    }

    ngOnInit(): void {
        this.editStartedSubscription = this.shoppingListService.editStarted.subscribe(
            (id: number) => {
                this.editMode = true;
                this.editModeId = id;
                this.editItem = this.shoppingListService.getIngredientById(id);
                this.shoppingListForm.setValue({
                    name: this.editItem.name,
                    amount: this.editItem.amount
                })
            }
        )
    }

    ngOnDestroy(): void {
        this.editStartedSubscription.unsubscribe();
        this.editMode = false;
        this.editModeId = -1;
    }

    onAddItem(form: NgForm) {
        const value = form.value;
        const ingredient = new Ingredient(value.name, value.amount);

        if (this.editMode) {
            this.shoppingListService.updateIngredient(this.editModeId, ingredient)
        } else {
            this.shoppingListService.addIngredient(ingredient)
        }

        this.shoppingListForm.reset();
        this.editMode = false;
        this.editModeId = -1;
    }

    onDeleteItem() {
        this.shoppingListService.deleteIngredient(this.editModeId);
        this.onClearItem();
    }

    onClearItem() {
        this.shoppingListForm.reset();
        this.editMode = false;
        this.editModeId = -1;
    }
}

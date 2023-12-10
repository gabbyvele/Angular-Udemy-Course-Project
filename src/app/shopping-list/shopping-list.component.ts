import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from "../model/ingredient.model";
import {ShoppingListService} from "./shopping-list.service";
import {Subscription} from "rxjs";
import {LoggingService} from "../logging.service";

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    ingredients: Ingredient [];
    private ingredientsChangeSubscription: Subscription;

    constructor(private shoppingListService: ShoppingListService,
                private loggingService: LoggingService) {
    }

    ngOnInit(): void {
        this.loggingService.printLog('Shopping list initialised: ');
        this.ingredients = this.shoppingListService.getIngredients();
        this.ingredientsChangeSubscription = this.shoppingListService.ingredientsChanged
            .subscribe((ingredients: Ingredient[]) => {
                this.ingredients = ingredients;
            });
    }

    ngOnDestroy(): void {
        this.ingredientsChangeSubscription.unsubscribe();
    }

    onEditItem(id: number) {
        console.log("!!!");
        this.shoppingListService.editStarted.next(id);
    }
}

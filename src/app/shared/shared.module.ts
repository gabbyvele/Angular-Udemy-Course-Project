import {NgModule} from "@angular/core";
import {DropdownDirective} from "./directives/dropdown.directive";
import {LoadingSpinnerComponent} from "./loading-spinner/loading-spinner.component";
import {AlertComponent} from "./alert/alert.component";
import {PlaceholderDirective} from "./directives/placeholder.directive";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        DropdownDirective,
        LoadingSpinnerComponent,
        AlertComponent,
        PlaceholderDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DropdownDirective,
        LoadingSpinnerComponent,
        AlertComponent,
        PlaceholderDirective,
        CommonModule
    ]
})
export class SharedModule {

}

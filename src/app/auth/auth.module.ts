import {NgModule} from "@angular/core";
import {AuthComponent} from "./auth.component";
import {SharedModule} from "../shared/shared.module";
import {AuthRoutingModule} from "./auth-routing.module";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@NgModule(({
    declarations: [
        AuthComponent
    ],
    imports: [
        SharedModule,
        AuthRoutingModule,
        FormsModule,
    ]
}))
export class AuthModule {

}

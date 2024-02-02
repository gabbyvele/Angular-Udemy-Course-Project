import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Store, StoreModule} from "@ngrx/store";

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core.module";
import {shoppingListReducer} from "./shopping-list/store/shopping-list.reducer";
import {authReducer} from "./auth/store/auth.reducer";
import {appReducer} from "./store/app.reducer";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(appReducer),
    SharedModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

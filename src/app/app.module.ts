import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Store, StoreModule} from "@ngrx/store";

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core.module";
import {appReducer} from "./store/app.reducer";
import {EffectsModule} from "@ngrx/effects";
import {AuthEffects} from "./auth/store/auth.effect";

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
    EffectsModule.forRoot([AuthEffects]),
    SharedModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

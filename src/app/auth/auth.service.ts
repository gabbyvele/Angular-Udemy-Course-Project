import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import {logout} from "./store/auth.action";

@Injectable({providedIn: "root"})
export class AuthService {
  private tokenExpirationTimer: any;
  private store: Store<AppState> = inject(Store);

  setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(logout());
    }, expirationDuration);
  }

  clearLogoutTimer(){
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}

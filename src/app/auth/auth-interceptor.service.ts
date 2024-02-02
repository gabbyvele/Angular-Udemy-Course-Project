import {inject, Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {exhaustMap, map, take} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  private store: Store<AppState> = inject(Store);

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      exhaustMap(user => {
        console.log(user);
        if (!user) {
          return next.handle(req);
        }
        const updatedRequest = req.clone({params: new HttpParams().set('auth', user.getToken())});
        return next.handle(updatedRequest);
      }));
  }
}

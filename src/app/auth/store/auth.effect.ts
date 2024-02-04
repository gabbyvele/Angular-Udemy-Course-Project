import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Injectable, inject, effect} from "@angular/core";
import {authenticateSuccess, authenticateFail, loginStart, signupStart, logout, autoLogin} from "./auth.action";
import {catchError, of, switchMap, withLatestFrom} from "rxjs";
import {AuthResponse} from "../../model/auth-response.model";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {User} from "../../model/user.model";
import {AuthService} from "../auth.service";

@Injectable()
export class AuthEffects {

  private actions$ = inject(Actions);
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  handleAuthentication = (expiresIn: number, email: string, localId: string, idToken: string) => {
    const expirationDate = new Date(Date.now() + (expiresIn * 1000));

    const user = new User(email, localId, idToken, expirationDate);
    localStorage.setItem("user", JSON.stringify(user));

    this.authService.setLogoutTimer(expiresIn * 1000);

    return authenticateSuccess({
      email: email,
      id: localId,
      token: idToken,
      tokenExpirationDate: expirationDate,
      redirect: true
    });
  };

  handleError = (errorResponse: any) => {
    let message = 'An error occurred';
    if (errorResponse.error && errorResponse.error.error) {
      switch (errorResponse.error.error.message) {
        case 'EMAIL_NOT_FOUND':
          message = "Email does not exists"
          break;
        case 'EMAIL_EXISTS':
          message = "Email already exists"
          break;
      }
    }

    return of(authenticateFail({message: message}));
  }

  authSignup = createEffect(() =>
    this.actions$.pipe(
      ofType(signupStart),
      switchMap((signupStartAction) => {
        return this.httpClient
          .post<AuthResponse>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseApiKey,
            {
              'email': signupStartAction.email,
              'password': signupStartAction.password,
              'returnSecureToken': true
            }).pipe(
            map(resData => {
              return this.handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
            }),
            catchError(errorResponse => {
              return this.handleError(errorResponse);
            })
          );
      }),
    ),
  );

  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(loginStart),
      switchMap((loginStartAction) => {
        return this.httpClient
          .post<AuthResponse>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseApiKey,
            {
              'email': loginStartAction.email,
              'password': loginStartAction.password,
              'returnSecureToken': true
            }
          ).pipe(
            map(resData => {
              return this.handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)
            }),
            catchError(errorResponse => {
              return this.handleError(errorResponse);
            })
          );
      }),
    ));

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(autoLogin),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: Date
        } = JSON.parse(localStorage.getItem('user'));

        if (!userData) {
          return {type: 'DUMMY'};
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, userData._tokenExpirationDate);
        if (loadedUser.getToken()) {
          const expiresIn = new Date(userData._tokenExpirationDate).getTime() - Date.now();
          this.authService.setLogoutTimer(expiresIn);

          return authenticateSuccess({
            email: userData.email,
            id: loadedUser.id,
            token: loadedUser.getToken(),
            tokenExpirationDate: userData._tokenExpirationDate,
            redirect: false
          });
        }

        return {type: 'DUMMY'};
      })
    ));

  authLogout = createEffect(() =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem("user");
          this.router.navigate(['/auth']);
        })
      ),
    {dispatch: false});

  authRedirect = createEffect(() =>
      this.actions$.pipe(
        ofType(authenticateSuccess),
        tap(authenticateSuccessAction => {
          if (authenticateSuccessAction.redirect) {
            this.router.navigate(['/']);
          }
        })
      ),
    {dispatch: false});
}

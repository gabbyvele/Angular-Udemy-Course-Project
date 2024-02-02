import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthResponse} from "../model/auth-response.model";
import {BehaviorSubject, catchError, throwError} from "rxjs";
import {User} from "../model/user.model";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import {login, logout} from "./store/auth.action";

@Injectable({providedIn: "root"})
export class AuthService {
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  private store: Store<AppState> = inject(Store);

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  signUp(email: string, password: string) {
    console.log(email);
    console.log(password);
    return this.httpClient
      .post<AuthResponse>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseApiKey,
        {
          'email': email,
          'password': password,
          'returnSecureToken': true
        })
      .pipe(
        catchError(this.handleError),
        tap(response => {
          this.handleAuthentication(response)
        }));
  }

  login(email: string, password: string) {
    console.log(email);
    console.log(password);
    return this.httpClient
      .post<AuthResponse>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseApiKey,
        {
          'email': email,
          'password': password,
          'returnSecureToken': true
        })
      .pipe(
        catchError(this.handleError),
        tap(response => {
          this.handleAuthentication(response)
        }));
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date
    } = JSON.parse(localStorage.getItem('user'));

    if (!userData) {
      return;
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, userData._tokenExpirationDate);
    if (loadedUser.getToken()) {
      // this.user.next(loadedUser);
      this.store.dispatch(login({
        email: userData.email,
        id: loadedUser.id,
        token: loadedUser.getToken(),
        tokenExpirationDate: userData._tokenExpirationDate
      }));
      const expiresIn = new Date(userData._tokenExpirationDate).getTime() - Date.now();
      this.autoLogout(expiresIn);
    }
  }

  logout() {
    // this.user.next(null);
    this.store.dispatch(logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem("user");
    if (this.tokenExpirationTimer) {
      clearInterval(this.tokenExpirationTimer);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);

  }

  private handleError(errorResponse: HttpErrorResponse) {
    console.log('errorResponse');
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

    return throwError(message);
  }

  private handleAuthentication(response: AuthResponse) {
    const expirationDate = new Date(Date.now() + (+response.expiresIn * 1000));

    const user = new User(
      response.email,
      response.localId,
      response.idToken,
      expirationDate);

    this.store.dispatch(login({
      email: response.email,
      id: response.localId,
      token: response.idToken,
      tokenExpirationDate: expirationDate
    }));

    localStorage.setItem("user", JSON.stringify(user));
    this.autoLogout(+response.expiresIn * 1000);
    // return this.user.next(user);
  }
}

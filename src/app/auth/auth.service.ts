import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthResponse} from "../model/auth-response.model";
import {BehaviorSubject, catchError, throwError} from "rxjs";
import {User} from "../model/user.model";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({providedIn: "root"})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private httpClient: HttpClient,
                private router: Router) {
    }

    signUp(email: string, password: string) {
        console.log(email);
        console.log(password);
        return this.httpClient
            .post<AuthResponse>(
                "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB4HQ79RySqeIp-EaggHDYUpM5N0d-zl54",
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
                "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB4HQ79RySqeIp-EaggHDYUpM5N0d-zl54",
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
            this.user.next(loadedUser);
            const expiresIn = new Date(userData._tokenExpirationDate).getTime() - Date.now();
            this.autoLogout(expiresIn);
        }
    }

    logout() {
        this.user.next(null);
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

        localStorage.setItem("user", JSON.stringify(user));
        this.autoLogout(+response.expiresIn * 1000)
        return this.user.next(user);
    }
}

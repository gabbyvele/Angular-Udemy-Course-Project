import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Observable} from 'rxjs';
import {AuthResponse} from "../model/auth-response.model";
import {Router} from "@angular/router";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent {

    isLoginMode = true;
    isLoadingMode = false;
    error: string = null;

    constructor(private authService: AuthService,
                private router: Router) {
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(authForm: NgForm) {
        if (!authForm.valid) {
            return;
        }

        let authObservable: Observable<AuthResponse>;
        this.isLoadingMode = true;

        if (this.isLoginMode) {
            authObservable = this.authService.login(authForm.value.email, authForm.value.password);
        } else {
            authObservable = this.authService.signUp(authForm.value.email, authForm.value.password);
        }

        authObservable.subscribe(
            response => {
                console.log(response);
                this.isLoadingMode = false;
                this.router.navigate(['/recipes'])
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoadingMode = false;
            }
        );

        authForm.reset();
    }
}

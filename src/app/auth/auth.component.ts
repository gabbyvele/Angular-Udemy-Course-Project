import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Observable, Subscription} from 'rxjs';
import {AuthResponse} from "../model/auth-response.model";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../directives/placeholder.directive";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {

    isLoginMode = true;
    isLoadingMode = false;
    error: string = null;
    @ViewChild(PlaceholderDirective, {static: false}) modalHost: PlaceholderDirective;
    private closeSubscription: Subscription;

    constructor(private authService: AuthService,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) {
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
                this.showAlertModal(errorMessage);
            }
        );

        authForm.reset();
    }

    clearError() {
        this.error = null;
    }

    showAlertModal(errorMessage: string) {
        const modalFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

        const hostViewContainerRef = this.modalHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(modalFactory);
        componentRef.instance.message = errorMessage;
        this.closeSubscription = componentRef.instance.closeEvent.subscribe(() => {
            this.closeSubscription.unsubscribe();
            hostViewContainerRef.clear();
        })
    }

    ngOnDestroy(): void {
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe();
        }
    }
}

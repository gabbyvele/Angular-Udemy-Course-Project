import {Component, ComponentFactoryResolver, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Observable, Subscription} from 'rxjs';
import {AuthResponse} from "../model/auth-response.model";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/directives/placeholder.directive";
import {Store} from "@ngrx/store";
import {clearError, loginStart, signupStart} from "./store/auth.action";

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoadingMode = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) modalHost: PlaceholderDirective;
  private closeSubscription: Subscription;
  private storeSub: Subscription;
  private store = inject(Store);

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoadingMode = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showAlertModal("An error during login occurred");
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    let authObservable: Observable<AuthResponse>;
    // this.isLoadingMode = true;

    if (this.isLoginMode) {
      // authObservable = this.authService.login(authForm.value.email, authForm.value.password);
      this.store.dispatch(loginStart({email: authForm.value.email, password: authForm.value.password}))
    } else {
      this.store.dispatch(signupStart({email: authForm.value.email, password: authForm.value.password}))
    }

    authForm.reset();
    this.clearError();
  }

  clearError() {
    this.store.dispatch(clearError());
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

    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}

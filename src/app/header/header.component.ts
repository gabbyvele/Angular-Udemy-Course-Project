import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from "../shared/data-storage.service";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import {logout} from "../auth/store/auth.action";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  private userSubscription: Subscription;
  private store: Store<AppState> = inject(Store);

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').subscribe(authState => {
      this.isAuthenticated = !!authState.user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.saveRecipes();
  }

  onFetchData() {
    this.dataStorageService.getRecipes().subscribe();
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}

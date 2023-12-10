import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from "../shared/data-storage.service";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    collapsed = true;
    isAuthenticated = false;
    private userSubscription: Subscription;

    constructor(private dataStorageService: DataStorageService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.userSubscription = this.authService.user.subscribe(user => {
            this.isAuthenticated = !!user;
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
        this.authService.logout();
    }
}

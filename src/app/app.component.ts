import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {LoggingService} from "./logging.service";
import {Store} from "@ngrx/store";
import {AppState} from "./store/app.reducer";
import {autoLogin} from "./auth/store/auth.action";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular-Udemy-Course-Project';
  private store: Store<AppState> = inject(Store);

  constructor(private authService: AuthService,
              private loggingService: LoggingService) {
  }

  ngOnInit(): void {
    // this.authService.autoLogin();
    this.store.dispatch(autoLogin());
    this.loggingService.printLog("App started at: " + Date.toString())
  }
}

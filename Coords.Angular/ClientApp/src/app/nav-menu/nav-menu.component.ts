import {Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  public userTelegram: User | undefined = undefined;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  IsAuth(): Boolean {
    var token = localStorage.getItem('token');
    var res = token != null && token !== "";

    //if (res && this.user == undefined) {
    //  this.setUser();
    //}

    return res;
  }

  LogOut() {
    localStorage.removeItem('token');
  }

  private token: string | null;

  constructor(
    private http: HttpClient,
    private router: Router) {

    this.token = localStorage.getItem('token');
    if (this.token == null || this.token === "" || this.token == undefined) {
      this.router.navigate(['/login']);
      return;
    }

    this.setUser();
  }

  ngOnInit() { }

  setUser() {
    var url = environment.telegramAPI + "telegram/token/" + this.token;
    this.http.get<TokenResult>(url,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }),
      }).subscribe(result => {
        if (result == null || result.token === "") {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
          return;
        }

        this.setUserData(result.data);

      }, error => {
        console.error(error);

        localStorage.removeItem('token');
        this.router.navigate(['/login']);

        //this.tryGetToken(this.key);

        //localStorage.removeItem('key');
        //this.router.navigate(['/login']);
      });
  }
    setUserData(data: string) {
      var json = atob(data);
      this.userTelegram = JSON.parse(json);
    }
}

interface User {
  Id: string;
  UserName: string;
  Phone: string;
  FullName: string;
}

interface TokenResult {
  token: string;
  data: string;
  expired: Date;
}

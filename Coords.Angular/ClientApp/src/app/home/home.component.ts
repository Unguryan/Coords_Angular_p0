import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})


export class HomeComponent {
  public loading: boolean = false;

  public exp_minutes: string | 0 = 0;
  public exp_seconds: string | 0 = 0;

  private token: string | null;

  constructor(
    private http: HttpClient,
    private router: Router) {

    this.token = localStorage.getItem('token');
    if (this.token == null || this.token === "" || this.token == undefined) {
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnInit() {}
  getUser() {
    var url = environment.telegramAPI + "telegram/token/" + this.token;
    this.http.get<TokenResult>(url,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }),
      }).subscribe(result => {
        if (result == null) {
          localStorage.removeItem('token');
          this.router.navigate(['']);
          return;
        }

        alert("PAGE " + result.token);
        this.setUser(result.data);

      }, error => {
        console.error(error);

        localStorage.removeItem('token');
        this.router.navigate(['']);

        //this.tryGetToken(this.key);

        //localStorage.removeItem('key');
        //this.router.navigate(['/login']);
      });
  }
  setUser(data: string) {
    var json = atob(data);
    alert(json);
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

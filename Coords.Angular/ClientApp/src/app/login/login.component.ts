import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SignalrService } from '../signalr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {

  public loading: boolean = false;

  public exp_minutes: string | 0 = 0;
  public exp_seconds: string | 0 = 0;

  private basePath: string = "";

  private key: string | null;
  private token: string | null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private signalRService: SignalrService) {
    this.basePath = "http://localhost:5000/";

    this.token = localStorage.getItem('token');
    if (this.token != null && this.token !== "") {
      this.router.navigate(['']);
    }

    this.key = localStorage.getItem('key');
    if (this.key != null && this.key !== "") {
      this.getKeyInfo();
    }
  }

  ngOnInit()
  {
    this.signalRService.loginMessage.subscribe((loginResult: string) => {
      if (loginResult == null || loginResult === "" || loginResult == undefined) {
        return;
      }
      var jsonObj = JSON.parse(loginResult);
      var token = jsonObj.Token;
      var userData = jsonObj.Data;

     //alert("ALERT SIGNAL R: " + token);

      if (token == null || token === "" || token == undefined) {
        alert("TOKEN NULL");
      }
      else {
        localStorage.setItem('token', token);
        localStorage.removeItem('key');
        this.loading = false;
        this.router.navigate(['']);
        window.location.reload();
      }
    });
  }

  onLoginClick() {
    var url = environment.telegramAPI + "telegram/auth_link";
    this.http.get<AuthResult>(url,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }),
      }).subscribe(result => {
      if (result.url === "") {
        localStorage.removeItem('key');
        this.loading = false;
        return;
        }

        localStorage.setItem('key', result.key);
        this.loading = true;
        this.getKeyInfo();

        window.open(result.url);

    }, error => console.error(error));
  }

  onRefreshClick() {
    this.getKeyInfo();
    this.tryGetToken(this.key);
  }



  getKeyInfo() {
    this.token = localStorage.getItem('token');
    if (this.token != null && this.token !== "") {
      this.router.navigate(['']);
    }

    this.key = localStorage.getItem('key');
    if (this.key != null && this.key !== "") {
      var url = environment.telegramAPI + "telegram/auth_link/" + this.key;
      this.http.get<AuthKeyResult>(url,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }),
        }).subscribe(result => {
          if (result == null) {
            localStorage.removeItem('key');
            this.loading = false;
            return;
          }

          localStorage.setItem('key', result.key);
          this.loading = true;

          this.startCount(result.expired);

        }, error => {

          this.tryGetToken(this.key);

          localStorage.removeItem('key');
          this.router.navigate(['/login']);
        });

    }
    else {
      this.router.navigate(['']);
    }
  }


  
  startCount(expired: Date) {
    var expiredDate = new Date(expired);
    var countDownDate = expiredDate.getTime();
    var x = setInterval( () => {

      var now = new Date().getTime();//start

      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      //document.getElementById("demo").innerHTML = days + "d " + hours + "h "
      //    + minutes + "m " + seconds + "s ";

      this.exp_minutes = minutes > 9 ? "" + minutes : minutes == 0 ? 0 : "0" + minutes;
      this.exp_seconds = seconds > 9 ? "" + seconds : seconds == 0 ? 0 : "0" + seconds;

      // If the count down is finished, write some text
      if (distance < 0) {
        this.loading = false;
        clearInterval(x);
        this.exp_minutes = 0;
        this.exp_seconds = 0;
      }
    }, 1000);
}



  tryGetToken(key: string | null) {
    var url = environment.telegramAPI + "telegram/token/" + key;
    this.http.get<TokenResult>(url,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }),
      }).subscribe(result => {
        if (result == null) {
          return;
        }

        localStorage.setItem('token', result.token);
        this.loading = false;

        localStorage.removeItem('key');
        this.router.navigate(['']);
        window.location.reload();


      }, error => {
        console.error(error);
        //this.tryGetToken(this.key);

        //localStorage.removeItem('key');
        //this.router.navigate(['/login']);
      });
    }
}

interface AuthResult {
  url: string;
  key: string;
}

interface AuthKeyResult {
  key: string;
  expired: Date;
}

interface TokenResult {
  token: string;
  data: string;
  expired: Date;
}



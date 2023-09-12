import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  constructor(private authService: AuthService){

  }


  ngOnInit(): void {
    this.authService.authLogin();
  }
  title = 'javacornerng';
}

export const environment = {
 production:false,
 backendHost: "http://localhost:8082"
}
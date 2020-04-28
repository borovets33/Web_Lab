import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../admin-panel/list-user-page/list-user-page.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  addUser(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8080/users/all');
  }
}

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Message} from '../model/message.model';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) {
  }

  baseUrl = 'http://localhost:8080/messages/';

  getMessagesByChatId(id: number): Observable<Message[]> {
    return this.http.get<Message[]>(this.baseUrl + id);
  }
}



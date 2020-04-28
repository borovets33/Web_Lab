import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, ViewChildren} from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from '../model/message.model';
import {ChatMessageInfoDTO} from '../model/chat-message.model';
import {ChatService} from './chat.service';
/*import {CustomAuthService} from '../authentication/custom-auth.service';*/
/*import {Comment} from '../../model/comment.model';*/
import {DeleteMessageInfoDTO} from '../model/chat-message-delete.model';
(window as any).global = window;
// import {DeleteMessageInfoDTO} from "../../model/chat-message-delete.model";


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private chatService: ChatService) {
  }

  @Input() chatId: number;

  @ViewChild('content') content: ElementRef;

  serverUrl = 'http://localhost:8080/wss/';
  private stompClient;
  currentUserId: number;
  // tslint:disable-next-line:ban-types
  msg: String;
  messages: Message[] = [];
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  chatMessageInfo: ChatMessageInfoDTO = new ChatMessageInfoDTO(null, null, null);
  showEmojiPicker = false;

  ngOnInit() {
    // this.authService.getCurrentUser().subscribe(data => this.currentAccountId = data.id);
    this.initializeWebSocketConnection();
    this.chatService.getMessagesByChatId(4).subscribe(data => this.messages = data);
    this.scrollToBottom();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }




  initializeWebSocketConnection() {
    const wss = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(wss);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function(frame) {
      that.openSocket();
    });
  }

  openSocket() {
    this.stompClient.subscribe('/topic/messages/' + 4, (message) => {
      this.handleResult(message);
    });
  }

  handleResult(message) {

    if (message.body) {
      if ('deleted' === message.body.toString().substr(11, 7)) {
        const deletedMessage: DeleteMessageInfoDTO = JSON.parse(message.body);
        this.messages.splice(this.messages.findIndex(mes => mes.id === deletedMessage.messageId), 1);
      } else {
        const messageResult: Message = JSON.parse(message.body);
        this.messages.push(messageResult);
      }
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }


  sendMessage(message: string) {
    message = message.trim();
    if (message !== '') {
      /* this.chatMessageInfo.chatId = this.chatId;*/
      this.chatMessageInfo.chatId = 4;
      this.chatMessageInfo.userId = 1;
      this.chatMessageInfo.content = message;
      console.log(message);
      this.stompClient.send('/chat/send/message', {}, JSON.stringify(this.chatMessageInfo));
    }
  }

  deleteMessage(mes) {
    const isSubmit = confirm('Do you really want to delete a message?');
    console.log(this.messages);
    if (isSubmit) {
      this.stompClient.send('/chat/delete/message', {}, JSON.stringify(new DeleteMessageInfoDTO(mes.chatId, mes.id, mes.senderId)));
    }
    console.log('delete message');
  }

}


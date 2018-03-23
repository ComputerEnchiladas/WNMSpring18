import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppSocketService {

  private _listener = new Subject();
  constructor() {
    let server = io.connect('127.0.0.1:6085');

    server.on('event:temp', (val) => {
      this._listener.next( { event: 'event:temp', data: val });
    });

    server.on('event:led', (val) => {
      console.log('Hit Here.....', val);
      this._listener.next( { event: 'event:hello', data: val });
    });
  }

  on() { return this._listener.asObservable(); }

}

import { EventEmitter } from 'events';

import { OperationCodes } from './contents';
import Queue from './Queue';

// if (window === undefined) throw new Error('Unallowed access socket manager only useable on browser side!');

type commands = 'CONNECT_GUILD' | 'DESCONNECT_GUILD';
interface PayloadMain {
  op: number;
  t?: string | null;
  cmd?: commands;
  d?: any;
}

interface credentals {
  token: string | null;
  uid: string | null;
}

export class DmodWebSocket extends EventEmitter {
  _socket: WebSocket | null = null;
  _buck = new Queue();
  trys = 0;
  ready = false;

  async connect(credentals: credentals = { token: null, uid: null }) {
    this.ready = false;
    this.trys += 1;
    const { url } = await fetch(`${window.origin}/api/gateway`).then(b => b.json());
    const ws = (this._socket = new WebSocket(url));

    ws.onmessage = this.handelMessage.bind(this, credentals);
    ws.onerror = this.handelError.bind(this, credentals);
    ws.onclose = this.handelClose.bind(this, credentals);
  }

  disconnect({ code = 1000, reason = null } = {}) {
    if (!this._socket) return;
    this._socket.close(code, reason);
  }

  handelClose(credentals: credentals, { reason }) {
    if (!['RAU'].includes(reason)) {
      this.reconnect(credentals);
    }

    this.emit('close', reason);
  }

  handelError(credentals: credentals, event) {
    const error = event?.error ?? event;
    this.reconnect(credentals);
    this.emit('e', error || 'unknown');
  }

  reconnect(credentals: credentals) {
    if (this.trys < 5) {
      setTimeout(() => this.connect(credentals), 2000);
    }
  }

  handelMessage(credentals: credentals, event) {
    const payload = JSON.parse(event.data) as PayloadMain;

    console.log('%c[DMOD]', 'color:#00aeff;', '<-', payload);

    switch (payload.op) {
      case OperationCodes.REQUEST_AUTH: {
        this.identify(credentals);
        break;
      }

      case OperationCodes.AUTHENTICATION_PASS: {
        if (this._buck.queue.length > 0) {
          this._buck.run();
        }

        this.ready = true;
        this.emit('ready');
        break;
      }

      case OperationCodes.COMMAND_RESPONCE: {
        const { for: eventName, data } = payload.d;
        this.emit(eventName, data);
        break;
      }

      case OperationCodes.EVENT: {
        if (!payload.t) return;
        this.emit(payload.t, payload.d);
        break;
      }

      default:
        console.log(payload);
        break;
    }
  }

  requestConnect(guildID: string, hash: string) {
    this.send({
      op: OperationCodes.COMMAND,
      cmd: 'CONNECT_GUILD',
      d: {
        gid: guildID,
        token: hash,
      },
    });
  }

  requestDisconnect(guildID: string) {
    this.send({
      op: OperationCodes.COMMAND,
      cmd: 'DESCONNECT_GUILD',
      d: {
        gid: guildID,
      },
    });
  }

  identify(credentals: credentals) {
    this.send({
      op: OperationCodes.AUTHENTICATION,
      d: credentals,
    });
  }

  send(payload: PayloadMain) {
    const filterD = load => Object.fromEntries(Object.entries(load).filter(([k, v]) => k !== 'd' || (k === 'd' && !(v as { token?: string }).token)));

    if (this._socket === null || this._socket.readyState !== 1) {
      this._buck.add(() => {
        console.log('%c[DMOD]', 'color:#00aeff;', '->', filterD(payload));
        this._socket.send(JSON.stringify(payload));
      });
      return;
    }
    console.log('%c[DMOD]', 'color:#00aeff;', '->', filterD(payload));
    this._socket.send(JSON.stringify(payload));
  }
}

export default new DmodWebSocket();

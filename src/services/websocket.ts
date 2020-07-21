import { IPixel } from "./board";

class Ws {
  public socket: WebSocket

  private messageOperations = new Map<string, (data: any) => void>();

  public onPixelsMessage: (pixels: IPixel[]) => void = null;

  public onMessage: (message: string) => void = null;

  constructor(uuid: string) {
    this.setMessageOperations();

    this.socket = new WebSocket(`ws://localhost:3001/${uuid}`);

    this.socket.onopen = function(e) {
      console.log("[open] Connection established");
    };

    this.socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const operation = this.messageOperations.get(data.type); 
      console.log(operation);
      operation(data.data);
      console.log('[message] message received');
      console.log(event.data);
    };

    this.socket.onclose = (event: CloseEvent) => {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.log('[close] Connection died');
      }
    };

    this.socket.onerror = (event: Event) => {
      console.log(`[error]`);
    };
  }

  private sendMessage = (object: any) => {
    const jsonMsg = JSON.stringify(object);
    this.socket.send(jsonMsg);
  }

  joinPlace = (placeName: string) => {
    const msg = {
      operation: 'join',
      type: 'room',
      room: placeName,
    }
    this.sendMessage(msg);
  }

  leavePlace = (placeName: string) => {
    const msg = {
      operation: 'leave',
      type: 'room',
      room: placeName,
    }
    this.sendMessage(msg);
  }

  private setMessageOperations = () => {
    this.messageOperations.set(
      'pixels',
      (data) => {
        if (this.onPixelsMessage) {
          this.onPixelsMessage(data);
        }
      });

    this.messageOperations.set(
      'message',
      (data) => {
        const { message } = data;
        if (this.onMessage) {
          this.onMessage(message);
        }
      });
  }
}



export default Ws;
declare module 'stompjs' {
  export interface Message {
    body: string;
    headers: Record<string, string>;
  }

  export interface Client {
    connect(headers: Record<string, string>, connectCallback: () => void, errorCallback?: (error: string) => void): void;
    disconnect(disconnectCallback?: () => void): void;
    subscribe(destination: string, callback: (message: Message) => void, headers?: Record<string, string>): StompSubscription;
    send(destination: string, headers?: Record<string, string>, body?: string): void;
  }

  export interface StompSubscription {
    id: string;
    destination: string;
    unsubscribe(): void;
  }

  export function over(socket: WebSocket | SockJS): Client;
}

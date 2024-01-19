type Listener<T extends unknown[]> = (...args: T) => void;

export class EventEmitter<EventMap extends Record<string, unknown[]>> {
  private _eventListeners: {
    [K in keyof EventMap]?: Set<Listener<EventMap[K]>>;
  } = {};

  public on<K extends keyof EventMap>(eventName: K, listener: Listener<EventMap[K]>) {
    const listeners = this._eventListeners[eventName] ?? new Set();
    listeners.add(listener);
    this._eventListeners[eventName] = listeners;
  }

  public emit<K extends keyof EventMap>(eventName: K, ...args: EventMap[K]) {
    const listeners = this._eventListeners[eventName] ?? new Set();
    for (const listener of listeners) {
      listener(...args);
    }
  }
}

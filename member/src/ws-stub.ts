/**
 * Stub for isomorphic-ws that prevents 'ws' module from being required in browser.
 * This is used to prevent TYPE-001 errors from the dts-plugin.
 */

// Dummy WebSocket that fails gracefully
class DummyWebSocket {
  constructor(url: string) {
    this.readyState = 3; // CLOSED
  }
  readyState: number;
  onopen: any;
  onerror: any;
  onmessage: any;
  onclose: any;
  send() {
    // no-op
  }
  close() {
    // no-op
  }
}

export default DummyWebSocket;

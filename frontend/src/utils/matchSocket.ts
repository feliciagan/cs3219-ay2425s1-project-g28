import { io } from "socket.io-client";

const MATCH_SOCKET_URL = "http://localhost:3002";

export const matchSocket = io(MATCH_SOCKET_URL, {
  reconnectionAttempts: 3,
  autoConnect: false,
});

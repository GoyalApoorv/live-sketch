import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8000 })

wss.on('connection', function connection(ws) {
    ws.on('message', function connection(data) {
        ws.send('pong'); 
    })
})
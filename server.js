const { Socket } = require("engine.io");
const express = require("express")
const path = require("path")

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const porta = process.env.PORT || 3000 
const host = process.env.websocket-chat-project ? `https://${process.env.websocket-chat-project}.heroku.com` : "htpp://localhost"

app.use(express.static(path.join(__dirname,"public")))
app.set('views',path.join(__dirname,"public"))
app.engine("html",require("ejs").renderFile)
app.set("view engine","html")

app.use("/",(req, res)=>{
    res.render("index.html")
})

var messages = [];


io.on("connection",socket =>{
    console.log(`Socket conectado:${socket.id}`)
    socket.emit('mensagensAnteriores',messages)
    socket.on('sendMessage', data =>{
        messages.push(data)
        console.log(messages)
        socket.broadcast.emit('receivedMessage',data)
    })
})

server.listen(porta, ()=>{
    const portaStr = porta === 80 ? '' : ':' + porta
    if(process.env.websocket-chat-project){
        console.log("Servidor iniciado. Abra o navegador em " + host)
    }else{
    console.log(`Conectado à porta: ${porta}`)
    }
})
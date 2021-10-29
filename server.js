const { Socket } = require("engine.io");
const express = require("express")
const path = require("path")

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const porta = process.env.PORT || 3000 

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

    console.log(`Conectado!`)
    
})


setInterval(() => {
    messages.shift()
}, 120000);
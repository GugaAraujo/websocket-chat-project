const { Socket } = require("engine.io");
const { on } = require("events");
const express = require("express")
const path = require("path")
const socketService = require("./services/socket.service")

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

io.on("connection",socket =>{

    socketService.checkTotalUsers()

    socketService.sendsTotalUsers(socket)

    socketService.newUser(socket)

    socketService.sendMessageHistory(socket)

    socketService.forwardReceivedMessage(socket)

    socketService.userExit(socket)

    socketService.cleanHistoryPeriodically()

})

server.listen(porta,()=>console.log(`Conectado!`))





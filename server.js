const { Socket } = require("engine.io");
const { on } = require("events");
const express = require("express")
const path = require("path")
const socketService = require("./services/socket.service")

const db = require("./database/config");
const mongoose = require("mongoose");

 mongoose.connect(db.dbUrl, { useNewUrlParser: true });
  
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

io.on("connection",socket => socketService.socketInit(socket))

server.listen(porta,()=>console.log(`Conectado!`))





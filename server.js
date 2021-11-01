const { Socket } = require("engine.io");
const { on } = require("events");
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
const intervalo_remocacao_frases = 120000

let total_online = 0
let record_online = 0

const saudacao = `Seja bem vindo! &#128516`
const aviso = `A cada ${intervalo_remocacao_frases/60000} minutos, uma frase é removida no histórico do chat. Nada ficará gravado por muito tempo.`


io.on("connection",socket =>{
    //contando total de usuários ativos e conferindo se ultrapasssa o record
    total_online ++
    if(total_online>record_online){record_online=total_online}


    console.log(`
    O dispositivo ${socket.id} ainda está online. 
    Total online: ${total_online}. 
    Recorde de usuários simultâneos: ${record_online}
     `)


    console.log(`Socket conectado:${socket.id}`)

    //aviso de entrada de novo usuario
    let entrou_usuario = `${socket.id} entrou na sala. Total online: ${total_online}. Recorde online: ${record_online}`
    socket.broadcast.emit("aviso",entrou_usuario)


    socket.emit('mensagensAnteriores',messages)
    socket.emit('entrada',saudacao)
    setTimeout(()=>{
        socket.emit('aviso',aviso)
    },2000)

    socket.on('sendMessage', data =>{
        messages.push(data)
        console.log(messages)
        socket.broadcast.emit('receivedMessage',data)
    })

    socket.on('disconnect', function(data) {
        total_online = total_online -1


          //aviso de entrada de novo usuario
    let saiu_usuario = `${socket.id} saiu da sala. Total online: ${total_online}. Recorde online: ${record_online}`
    socket.broadcast.emit("aviso",saiu_usuario)


        console.log(`
O dispositivo ${socket.id} saiu. 
Total online: ${total_online}. 
Recorde de usuários simultâneos: ${record_online}
         `)

    });
})

server.listen(porta, ()=>{

    console.log(`Conectado!`)
    
})


setInterval(() => {
    messages.shift()
}, intervalo_remocacao_frases);
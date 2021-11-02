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


const intervalo_remover_frases = 120000

let messages = [];
let total_online = 0
let record_online = 0

const saudacao = `Seja bem vindo! &#128516`
const aviso = `A cada ${intervalo_remover_frases/60000} minutos, uma frase é removida no histórico do chat. Nada ficará gravado por muito tempo.`


io.on("connection",socket =>{

    //contando total de usuários ativos e conferindo se ultrapasssa o record
    total_online ++
    if(total_online>record_online){record_online=total_online}

    //Criando Objeto Placar, incluindo as contagens
    let placar = {
        total: total_online,
        record: record_online
    }

    //emitindo a todos a contagem, a cada entrada de usuário
    socket.emit("placar",placar)
    socket.broadcast.emit("placar",placar)
    console.log(placar)


    //aviso de entrada de novo usuario
    let entrou_usuario = `${socket.id} entrou na sala.`

    socket.broadcast.emit("aviso",entrou_usuario)


    //Enviando histórico, saudação e aviso sobre o histórico ao usuário recém chegado
    socket.emit('mensagensAnteriores',messages)
    socket.emit('entrada',saudacao)
    setTimeout(() => socket.emit('aviso',aviso),2000)


    //Ao receber mensagem, enviamos ao histórico temporário, exibimos no serivor e reenviamos a todos
    socket.on('sendMessage', data =>{
        messages.push(data)
        console.log(messages)
        socket.broadcast.emit('receivedMessage',data)
    })

    //No momento de desconexão do usuário, decrescemos nossa contagem de usuários online...
    socket.on('disconnect', function() {
        total_online = total_online -1

        //Criando Objeto Placar, incluindo as contagens atualizadas
        let placar = {
            total: total_online,
            record: record_online
        }

        //emitindo a todos a contagem, a cada saida de usuário
        socket.emit("placar",placar)
        socket.broadcast.emit("placar",placar)
        console.log(placar)



        // ... Então avisamos a todos sobre a saída do usuário
        let saiu_usuario = `${socket.id} saiu da sala.`
        socket.broadcast.emit("aviso",saiu_usuario)


    });
})

server.listen(porta,()=>console.log(`Conectado!`))

//Removendo do topo do histórico uma frase a cada intervalo de tempo pré determinado
setInterval(() => messages.shift(), intervalo_remover_frases);





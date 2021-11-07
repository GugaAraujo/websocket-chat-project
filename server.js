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


    socket.on('entrou_usuario', novo_usuario =>{
        let dataAtual = new Date();
        let hora = dataAtual.toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})


        socket.nome=novo_usuario.nome
        socket.color=novo_usuario.color

        usuario_entrante =
        {
            hora:hora,
            nome:novo_usuario.nome,
            color:novo_usuario.color
        }

        socket.broadcast.emit('aviso_novo_usuario',usuario_entrante)

        console.log(novo_usuario)
    })

    //Enviando histórico, saudação e aviso sobre o histórico ao usuário recém chegado
    socket.emit('mensagensAnteriores',messages)
    socket.emit('entrada',saudacao)
    setTimeout(() => socket.emit('aviso',aviso),2000)


    //Ao receber mensagem, enviamos ao histórico temporário, exibimos no serivor e reenviamos a todos
    socket.on('sendMessage', data =>{
        let dataAtual = new Date();
        let hora = dataAtual.toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})

        data = {
            nome: data.nome,
            message: data.message,
            color: data.color,
            hora: hora
        }
        messages.push(data)
        console.log(messages)
        socket.broadcast.emit('receivedMessage',data)
        console.log("enviado, data:",data)
    })

    //No momento de desconexão do usuário, decrescemos nossa contagem de usuários online...
    socket.on('disconnect', function() {
        total_online = total_online -1

        let dataAtual = new Date();
        let hora = dataAtual.toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})

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
        let usuario_sainte = {
            hora:hora,
            nome:socket.nome,
             color:socket.color
            }
        socket.broadcast.emit("usuario_sainte",usuario_sainte)
        console.log(socket)


    });
})

server.listen(porta,()=>console.log(`Conectado!`))

//Removendo do topo do histórico uma frase a cada intervalo de tempo pré determinado
setInterval(() => messages.shift(), intervalo_remover_frases);






const Record = require("../model/record.model")

// Histórico de mensagens
let messages = [];

//Criando Objeto scoreboard, incluindo as contagens
let scoreboard = {
	total: 0,
	record: 0,
}

const phraseRemovalRange = 120000
const welcomeMessage = `Seja bem vindo! &#128516`
const historyRemovalAlert = `A cada ${phraseRemovalRange/60000} minutos, uma frase é removida no histórico do chat. Nada ficará gravado por muito tempo.`

async function newRecord(newRecord){
    scoreboard.record++
	await Record.findOneAndUpdate({"record":newRecord})
}

function getTime(){
	return new Date().toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})
}

function checkTotalUsers(socket){
    //contando total de usuários ativos e conferindo se ultrapasssa o record
    scoreboard.total++;

    Record.find()
    .then(result =>{
        result.length === 0
        ?	Record.create({"record":1})
        : scoreboard.record = result[0].record
    })
    .then(() => {
        console.log(scoreboard.total, scoreboard.record)
        scoreboard.total > scoreboard.record ? newRecord(scoreboard.total) : ''
    })
    .then(()=> sendsTotalUsers(socket))
    .catch(console.log)

}

function sendsTotalUsers(socket){
    //emitindo a todos a contagem, a cada entering de usuário
    socket.emit("scoreboard",scoreboard)
    socket.broadcast.emit("scoreboard",scoreboard)	
}

function newUser(socket){
    socket.on('enteredUser', newUser =>{

        socket.name=newUser.name
        socket.color=newUser.color

        enteredUser =
        {
            hora:getTime(),
            name:newUser.name,
            color:newUser.color
        }

        socket.broadcast.emit('historyRemovalAlert_newUser',enteredUser)
    })

}

function sendMessageHistory(socket){
    //Enviando histórico, saudação e historyRemovalAlert sobre o histórico ao usuário recém chegado
    socket.emit('PreviousMessages',messages)
    socket.emit('entering',welcomeMessage)
    setTimeout(() => socket.emit('historyRemovalAlert',historyRemovalAlert),2000)	
}

function forwardReceivedMessage(socket){
    //Ao receber mensagem, enviamos ao histórico temporário, exibimos no serivor e reenviamos a todos
    socket.on('sendMessage', newMessage =>{

        newMessage = {
            name: newMessage.name,
            message: newMessage.message,
            color: newMessage.color,
            hora: getTime()
        }
        messages.push(newMessage)
        socket.broadcast.emit('receivedMessage',newMessage)
    })
}

function userExit(socket){	
//No momento de desconexão do usuário, decrescemos nossa contagem de usuários online...
socket.on('disconnect', function() {
    scoreboard.total--

    //emitindo a todos a contagem, a cada saida de usuário
    socket.emit("scoreboard",scoreboard)
    socket.broadcast.emit("scoreboard",scoreboard)

    // ... Então avisamos a todos sobre a saída do usuário
    let outgoingUser = {
        hora:getTime(), 
        name:socket.name,
         color:socket.color
        }
    socket.broadcast.emit("outgoingUser",outgoingUser)

});
}

function cleanHistoryPeriodically(){
    //Removendo do topo do histórico uma frase a cada intervalo de tempo pré determinado
    setInterval(() => messages.shift(), phraseRemovalRange);
}

module.exports = {

    socketInit(socket){

        checkTotalUsers(socket)
        newUser(socket) 
        sendMessageHistory(socket)
        forwardReceivedMessage(socket)
        userExit(socket)
        cleanHistoryPeriodically()

    },
};

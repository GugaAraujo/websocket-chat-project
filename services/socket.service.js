const Record = require("../model/record.model")
const User = require("../model/user.model")
const Message = require("../model/message.model")

let allMessagesSent = [];
let usersConnectedNow = [];

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

function updateUsersConnectedNow(socket){
    usersConnectedNow.push({name:socket.name,id:socket.id})
    socket.broadcast.emit('usersConnectedNow',usersConnectedNow)   
}

function newUser(socket){
    socket.on('enteredUser', newUser =>{

        socket.name = newUser.name
        socket.color = newUser.color

        const enteredUser = new User(newUser.name, newUser.color, getTime())

        socket.broadcast.emit('alert_newUser',enteredUser)
        updateUsersConnectedNow(socket)
    })

}

function sendMessageHistory(socket){
    //Enviando histórico, saudação e historyRemovalAlert sobre o histórico ao usuário recém chegado
    socket.emit('PreviousMessages', allMessagesSent)
    socket.emit('entering',welcomeMessage)
    setTimeout(() => socket.emit('historyRemovalAlert', historyRemovalAlert),2000)	
}

function forwardReceivedMessage(socket){
    //Ao receber mensagem, enviamos ao histórico temporário, exibimos no serivor e reenviamos a todos
    socket.on('sendMessage', newMessage =>{

        const message = new Message(newMessage.name, newMessage.message, newMessage.color, getTime())
        
        allMessagesSent.push(message)
        socket.broadcast.emit('receivedMessage',message)
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
    const outgoingUser = new User(socket.name, socket.color, getTime())
    socket.broadcast.emit("outgoingUser",outgoingUser)
});
}

function cleanHistoryPeriodically(){
    //Removendo do topo do histórico uma frase a cada intervalo de tempo pré determinado
    setInterval(() => allMessagesSent.shift(), phraseRemovalRange);
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
const { Socket } = require("engine.io");

let messages = [];

//Criando Objeto Placar, incluindo as contagens
let placar = {
	total: 0,
	record: 0,
}

const intervalo_remover_frases = 120000

const saudacao = `Seja bem vindo! &#128516`
const aviso = `A cada ${intervalo_remover_frases/60000} minutos, uma frase é removida no histórico do chat. Nada ficará gravado por muito tempo.`

function getTime(){
	return new Date().toLocaleTimeString('pt-BR', {timeZone: 'America/Sao_Paulo'})
}

module.exports = {


	incrementsTotalUsers(){
		return placar.total++;
	},

	checkTotalUsers() {
		this.incrementsTotalUsers()
		//contando total de usuários ativos e conferindo se ultrapasssa o record
		if (placar.total > placar.record) {
			return placar.record = placar.total;
		}
	},

	sendsTotalUsers(socket){
		//emitindo a todos a contagem, a cada entrada de usuário
		socket.emit("placar",placar)
		socket.broadcast.emit("placar",placar)
		console.log(placar)		
	},

	newUser(socket){
		socket.on('entrou_usuario', novo_usuario =>{

			socket.nome=novo_usuario.nome
			socket.color=novo_usuario.color
	
			usuario_entrante =
			{
				hora:getTime(), //correto
				nome:novo_usuario.nome,
				color:novo_usuario.color
			}
	
			socket.broadcast.emit('aviso_novo_usuario',usuario_entrante)
	
			console.log(novo_usuario)
		})
	
	},

	sendMessageHistory(socket){
		//Enviando histórico, saudação e aviso sobre o histórico ao usuário recém chegado
		socket.emit('mensagensAnteriores',messages)
		socket.emit('entrada',saudacao)
		setTimeout(() => socket.emit('aviso',aviso),2000)	
	},

	forwardReceivedMessage(socket){
		//Ao receber mensagem, enviamos ao histórico temporário, exibimos no serivor e reenviamos a todos
		socket.on('sendMessage', data =>{
	
			data = {
				nome: data.nome,
				message: data.message,
				color: data.color,
				hora: getTime() // exibe o tempo ao recebidor
			}
			messages.push(data)
			console.log(messages)
			socket.broadcast.emit('receivedMessage',data)
			console.log("enviado, data:",data)
		})
	},

	userExit(socket){	
    //No momento de desconexão do usuário, decrescemos nossa contagem de usuários online...
    socket.on('disconnect', function() {
        placar.total = placar.total -1

        //emitindo a todos a contagem, a cada saida de usuário
        socket.emit("placar",placar)
        socket.broadcast.emit("placar",placar)
        console.log(placar)

        // ... Então avisamos a todos sobre a saída do usuário
        let usuario_sainte = {
            hora:getTime(), //correto
            nome:socket.nome,
             color:socket.color
            }
        socket.broadcast.emit("usuario_sainte",usuario_sainte)

    });
	},

	cleanHistoryPeriodically(){
		//Removendo do topo do histórico uma frase a cada intervalo de tempo pré determinado
		setInterval(() => messages.shift(), intervalo_remover_frases);
	}

};

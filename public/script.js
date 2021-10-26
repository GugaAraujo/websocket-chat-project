var socket = io("http://localhost:3000")
var botao = document.getElementById("enviar")


botao.addEventListener("click",(event)=>{
    event.preventDefault()
    var author = document.getElementById("input_username")
    var message = document.getElementById("input_message")  
        var messageObject = {
            author: author.value,
            message: message.value,
        }

        render_mensagem_Enviada(messageObject)

        socket.emit('sendMessage', messageObject)
        console.log(messageObject)
    
})



socket.on("mensagensAnteriores", function(messages){
    for (message of messages){
        render_mensagem_recebida(message)
    }
})


socket.on("receivedMessage", function(message){
    console.log(message)
    render_mensagem_recebida(message)
})





function render_mensagem_recebida(message){
    $('.caixa_chat').append('<div class="message"><strong><span style="color:green">'+message.author+'</span></strong>: '+message.message+'</div>')
}


function render_mensagem_Enviada(message){
    $('.caixa_chat').append('<div class="message"><strong><span style="color:blue">'+message.author+'</span></strong>: '+message.message+'</div>')
}





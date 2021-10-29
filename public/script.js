


const socket = io("/ ")
const botao = document.getElementById("enviar")
var botao_color = document.getElementById("color")
botao_color.value = "#000000"
let cor_escolhida = ""






botao_color.addEventListener("change",()=>{
    cor_escolhida = botao_color.value
    var author = document.getElementById("input_username").style.color = cor_escolhida;
})

botao.addEventListener("click",(event)=>{
    event.preventDefault()
    var author = document.getElementById("input_username")
    var message = document.getElementById("input_message")  
        var messageObject = {
            author: author.value,
            message: message.value,
            color: cor_escolhida,
        }

        render_mensagem_Enviada(messageObject)

        socket.emit('sendMessage', messageObject)
        message.value =""
})

window.document.addEventListener('keyup', function(event){
    if (event.key == 13|| event.key === "Enter") {
        event.preventDefault()
        var author = document.getElementById("input_username")
        var message = document.getElementById("input_message")  
            var messageObject = {
                author: author.value,
                message: message.value,
                color: cor_escolhida,
            }
    
            render_mensagem_Enviada(messageObject)
    
            socket.emit('sendMessage', messageObject)
       

        message.value =""
      }
});



socket.on("mensagensAnteriores", function(messages){
    for (message of messages){
        render_mensagem_recebida(message)
    }
})


socket.on("receivedMessage", function(message){
    render_mensagem_recebida(message)
})





function render_mensagem_recebida(message){
    let dataAtual = new Date();
let hora = dataAtual.toLocaleTimeString()
    $('.caixa_chat').append(`<div class="message"><span style="color:#a2a2a2;font-size:12px">${hora} - </span><strong><span style="color:${message.color}">${message.author}</span></strong>: <span style="padding-left:10px">${message.message}</span></div>`)
    var myDiv = document.getElementById("caixa_chat");
    myDiv.scrollTop = myDiv.scrollHeight;
}


function render_mensagem_Enviada(message){
    let dataAtual = new Date();
let hora = dataAtual.toLocaleTimeString()
    $('.caixa_chat').append(`<div class="message"><span style="color:#a2a2a2;font-size:12px">${hora} - </span><strong><span style="color:${cor_escolhida}">${message.author}</span></strong>: <span style="padding-left:10px">${message.message}</span></div>`)
var myDiv = document.getElementById("caixa_chat");
    myDiv.scrollTop = myDiv.scrollHeight;
}





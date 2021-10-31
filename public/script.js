


const socket = io(location.origin.replace(/^http/, 'ws'))

const botao = document.getElementById("enviar")
let botao_color = document.getElementById("color")
let msgm_erro_form = document.getElementById("erro_form") 
botao_color.value = "#000000"
let cor_escolhida = ""






botao_color.addEventListener("change",()=>{
    cor_escolhida = botao_color.value
    let author = document.getElementById("input_username").style.color = cor_escolhida;
})

botao.addEventListener("click",(event)=>{
    event.preventDefault()
    let author = document.getElementById("input_username")
    let message = document.getElementById("input_message")  
        let messageObject = {
            author: author.value,
            message: message.value,
            color: cor_escolhida,
        }

        if(message.value.length>0&&author.value.length>0){
            msgm_erro_form.style.display = "none"
            render_mensagem_Enviada(messageObject)

            socket.emit('sendMessage', messageObject)
            message.value =""
        }else{
            msgm_erro_form.style.display = "block"
        }


})

window.document.addEventListener('keyup', function(event){
    if (event.key == 13|| event.key === "Enter") {
        event.preventDefault()
        let author = document.getElementById("input_username")
        let message = document.getElementById("input_message")  
            let messageObject = {
                author: author.value,
                message: message.value,
                color: cor_escolhida,
            }
    
     
            if(message.value.length>0&&author.value.length>0){
                msgm_erro_form.style.display = "none"
                render_mensagem_Enviada(messageObject)
    
                socket.emit('sendMessage', messageObject)
                message.value =""
            }else{
                msgm_erro_form.style.display = "block"
            }
      }
});


socket.on("entrada", function(saudacao,aviso){
    $('.caixa_chat').append(`<div class="saudacao"><span>${saudacao}</span></div>`)
})
socket.on("aviso", function(aviso){
    $('.caixa_chat').append(`<div class="aviso"><span>${aviso}</span></div>`)
})

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
    let myDiv = document.getElementById("caixa_chat");
    myDiv.scrollTop = myDiv.scrollHeight;
}


function render_mensagem_Enviada(message){
    let dataAtual = new Date();
let hora = dataAtual.toLocaleTimeString()
    $('.caixa_chat').append(`<div class="message"><span style="color:#a2a2a2;font-size:12px">${hora} - </span><strong><span style="color:${cor_escolhida}">${message.author}</span></strong>: <span style="padding-left:10px">${message.message}</span></div>`)
let myDiv = document.getElementById("caixa_chat");
    myDiv.scrollTop = myDiv.scrollHeight;
}





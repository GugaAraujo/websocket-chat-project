

//formulário do Modal
let campo_nome = document.getElementById("input_username")
let btn_username = document.getElementById("btn_username")

//seletor de cor
let botao_color = document.getElementById("color")
botao_color.value = "#000000"
let cor_escolhida = ""

let author = document.getElementById("input_username")
author.value=""


//Atribuindo nova cor de nick, que será enviada no Objeto MessageObject
botao_color.addEventListener("change",()=>{
    cor_escolhida = botao_color.value
    author.style.color = cor_escolhida;
})



// Get the modal
let modal = document.getElementById("modal");




// Get the button that opens the modal
let btn = document.getElementById("btn_username");
btn.addEventListener("click",(event)=>{
    modal.style.display = "block";
});

// Get the <span> element that closes the modal
let span = document.getElementById("close")
span.addEventListener("click",(event)=>{
    if(campo_nome.value.length>0){
    modal.style.display = "none";
}
});









// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal&&campo_nome.value.length>0) {
    modal.style.display = "none";   
  }
} 

window.document.addEventListener('keyup', function(event){
    if (event.key == 13|| event.key === "Enter") {
        if(event.target == campo_nome&&campo_nome.value.length>0){
            modal.style.display = "none";
        }
      }
});

























const socket = io(location.origin.replace(/^http/, 'ws'))

let total_online = document.getElementById("total_online")
let record_online = document.getElementById("record_online")

const btn_enviar = document.getElementById("enviar")
let msgm_erro_form = document.getElementById("erro_form") 





let message = document.getElementById("input_message")
message.value = ""





//Enviando mensagens através de evento de ENTER e Click
btn_enviar.addEventListener("click",(event)=>{
    enviar_mensagem(event)
})

window.document.addEventListener('keyup', function(event){
    if (event.key == 13|| event.key === "Enter") {
        if(event.target==message){
            enviar_mensagem(event)
        }
      }
});


//Recebimento de mensagens do servidor
socket.on("placar", (placar)=>{
    total_online.textContent = placar.total
    record_online.textContent = placar.record
})

socket.on("entrada", function(saudacao){
    $('.caixa_chat').append(`<div class="saudacao"><span>${saudacao}</span></div>`)
})

socket.on("aviso", function(aviso){
    $('.caixa_chat').append(`<div class="aviso"><span>${aviso}</span></div>`)
})

socket.on("mensagensAnteriores", function(messages){
    for (message of messages){
        render_mensagem(message,message.color)
    }
})

socket.on("receivedMessage", function(message){
    render_mensagem(message,message.color)
})







// ============= Funções declaradas =================


// O primeiro parametro se refere ao MessageObject
//O segundo será: Ou cor escolhida, no caso de envio de mensagem, ou a cor de quem enviou a mensagem
function render_mensagem(message,cor_do_nick){
    let dataAtual = new Date();
let hora = dataAtual.toLocaleTimeString()
    $('.caixa_chat').append(`<div class="message"><span style="color:#a2a2a2;font-size:12px">${hora} - </span><strong><span style="color:${cor_do_nick}">${message.author}</span></strong>: <span style="padding-left:10px">${message.message}</span></div>`)
let myDiv = document.getElementById("caixa_chat");
    myDiv.scrollTop = myDiv.scrollHeight;
}

//Verificando os imputs estão preenchidos antes de renderizar na tela e enviar o MessageObject ao servidor.
function enviar_mensagem(event){
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
            render_mensagem(messageObject,cor_escolhida)

            socket.emit('sendMessage', messageObject)
            message.value =""
        }else{
            msgm_erro_form.style.display = "block"
        }
}

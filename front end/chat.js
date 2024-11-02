const socket = io(); 
const chatList = document.getElementById('chatList');
const messageList = document.getElementById('messageList');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

let currentChat = null;

// Cargar la lista de chats al cargar la página
fetch('https://learn-hub-eta.vercel.app/api/chats')
    .then(response => response.json())
    .then(chats => {
        chats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.textContent = chat.nombre;
            chatItem.classList.add('chat-item');
            chatItem.addEventListener('click', () => {
                loadChat(chat.idprof, chat.idalumno);
            });
            chatList.appendChild(chatItem);
        });
    })
    .catch(error => console.error("Error al cargar la lista de chats:", error));

// Función para cargar el historial de un chat
function loadChat(idprof, idalumno) {
    currentChat = { idprof, idalumno };
    fetch(`https://learn-hub-eta.vercel.app/api/messages?idprof=${idprof}&idalumno=${idalumno}`)
        .then(response => response.json())
        .then(messages => {
            messageList.innerHTML = '';
            messages.forEach(message => {
                const messageItem = document.createElement('div');
                messageItem.textContent = `${message.content} - ${new Date(message.timestamp).toLocaleString()}`;
                messageItem.classList.add('message-item', message.sender === 'me' ? 'sent' : 'received');
                messageList.appendChild(messageItem);
            });
            messageList.scrollTop = messageList.scrollHeight; // Scroll al final
        })
        .catch(error => console.error("Error al cargar mensajes:", error));
}

// Enviar un mensaje
messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (messageInput.value && currentChat) {
        const message = {
            idprof: currentChat.idprof,
            idalumno: currentChat.idalumno,
            content: messageInput.value
        };
        socket.emit('chat message', message);
        
        // Mostrar el mensaje inmediatamente en la interfaz
        const messageItem = document.createElement('div');
        messageItem.textContent = `${message.content} - ${new Date().toLocaleString()}`;
        messageItem.classList.add('message-item', 'sent');
        messageList.appendChild(messageItem);
        messageList.scrollTop = messageList.scrollHeight; // Scroll al final

        messageInput.value = ''; // Limpiar el campo de entrada
    }
});

// Escuchar mensajes entrantes
socket.on('chat message', (message) => {
    if (message.idprof === currentChat.idprof && message.idalumno === currentChat.idalumno) {
        const messageItem = document.createElement('div');
        messageItem.textContent = `${message.content} - ${new Date(message.timestamp).toLocaleString()}`;
        messageItem.classList.add('message-item', 'received');
        messageList.appendChild(messageItem);
        messageList.scrollTop = messageList.scrollHeight; // Scroll al final
    }
});
const form = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById("room-name");
const userUl = document.getElementById("users");
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

const socket = io();

// Joining a chatroom : 
socket.emit("joinRoom",{username,room});

socket.on("roomUsers",({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
})
// Message from the server : 
socket.on("message", (message) => {
    console.log(message);
    outputMessage(message);
    // Sroll down wherever the message is : 
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submission : 
form.addEventListener('submit', (event) => {
    event.preventDefault();
    // Getting the message :
    const msg = event.target.elements.msg.value;
    // Emitting the message to the server : 
    socket.emit('chatMessage', msg);
    event.target.reset();
})

// Output message from DOM : 
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room){
    roomName.innerText = room;
}

// Adding users to the DOM : 
function outputUsers(users){
    userUl.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join("")}`;
}
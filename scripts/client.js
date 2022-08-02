const socket = io("http://localhost:8000");
const form = document.getElementById("send-form");
const messageInput = document.getElementById("inputMsg");
const messageContainer = document.querySelector(".container");
const groupName = document.querySelector(".group");
var audio = new Audio("../assets/Chat-1.mp3");

const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == "left")      // so that the sound is played only when the message is received
    {
        audio.play();
    }
};

// if the form gets submitted, send the message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();     // prevent the page from refreshing
    const message = messageInput.value;
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
});

// Ask new user for his/her name and let the server know
const name = prompt("Enter your beautiful name to join the chat😃");
socket.emit("new-user-joined", name);
groupN = prompt("Enter the group name to join the chat😃");
groupName.innerText = "GROUP : - " + groupN;

// if a new user joins the chat, receive his/her name from the server
socket.on("user-joined", name => {
    append(`${name} joined the chat`, "right");
});

// if the server sends message to the client, receive it from the server
socket.on("receive", data => {
    append(`${data.name}: ${data.message}`, "left");
});

// if a user leaves the chat, append the info to the container
socket.on("left", name => {
    append(`${name} left the chat`, "right");
});

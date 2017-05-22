(function(){

    chat = {
        
        init: function() {
        
            this.chat = document.querySelector("#chat");
            this.joinButton = document.querySelector("#join");
            this.usernameField = document.querySelector("#username-field");

            this.connectToServer();
            
            this.joinButton.onclick = this.joinToChat.bind(this);

        },

        connectToServer: function() {

            var host = window.location.origin.replace(/^http/, "ws");

            this.socket = new WebSocket(host + ":42780");
            this.socket.onmessage = this.displayMessage.bind(this);

        },

        joinToChat: function(e) {
            e.preventDefault();

            this.username = this.usernameField.value.trim();

            if(this.username.trim() !== ""){

                this.chat.removeChild(document.querySelector("#join-user-form"));
                this.revealMessageForm();
            
                this.sendData({
                    type: "join",
                    name: this.username,
                });
            }          
            
        },

        sendMessage: function(e) {
            e.preventDefault();

            var msg = this.formatText(this.messageField.value.trim());

            if(msg !== "") {
                this.sendData({
                    type: "message",
                    name: this.username,
                    message: msg
                });
            }

            this.messageField.value = "";

        },

        displayMessage: function(e) {
            var dataObj = JSON.parse(e.data);
            this.renderCloud(dataObj);
        },

        sendData: function(dataObj) {
            var data = JSON.stringify(dataObj);
            this.socket.send(data);
        },

        formatText: function(string) {
            
            return string.replace(/</g,"&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");            
        },

        revealMessageForm: function() {

            var elements = "<div id='chat-window'></div>"+
                "<form id='message-form'>"+
                "<textarea autofocus rows='2' id='message-field' style='resize: none;' placeholder='Type message..'></textarea>"+
                "<button type='submit' id='send'>Send</button>"+
                "</form>";
                
            this.chat.innerHTML = elements;

            this.chatWindow = document.querySelector("#chat-window");
            this.messageField = document.querySelector("#message-field");
            this.sendButton = document.querySelector("#send");

            this.sendButton.onclick = this.sendMessage.bind(this);
            this.messageField.onkeypress = this.pressEnter.bind(this);

        },

        pressEnter: function(e) {
            if(e.which === 13 && !(e.shiftKey)) {
                this.sendMessage(e);
            }
        },

        renderCloud: function(objData) {

            var chatRow = document.createElement("div"),
                date = new Date(),
                time = date.toTimeString().split(' ')[0];
                
            var element = document.createElement("div");
            element.classList.add("cloud");

            this.checkMessageType(objData, element);

            if(objData.type === "status") {            
                 
                element.innerHTML = "<header>"+
                                        "<time>"+ time +"</time>"+
                                    "</header>"+
                                    "<p class='content'>" + objData.message + "</p>";

            } else {
                element.innerHTML = "<header>"+
                                        "<time>"+ time +"</time><p class='username'>" + objData.name + "</p>"+
                                    "</header>"+
                                    "<p class='content'>" + objData.message + "</p>";
            }


            this.chatWindow.appendChild(element);
            this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
            
        },

        checkMessageType: function(objData, elem) {

            if(objData.name === this.username) {
                elem.classList.add("my-post");
            } else if(objData.type === "status"){
                elem.classList.add("status");
            } else {
                elem.classList.add("user-post");
            }
        }                

    };

    chat.init();

})();
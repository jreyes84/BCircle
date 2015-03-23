'use strict';

angular.module('core').directive('chatui', [
	function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				// var chatUsers       = $('.chat-users');
		  //       var chatTalk        = $('.chat-talk');
		  //       var chatMessages    = $('.chat-talk-messages');
		  //       var chatInput       = $('#sidebar-chat-message');
		  //       var chatMsg         = '';

		  //       // Initialize scrolling on chat talk list
		  //       $('.chat-talk-messages').slimScroll({ height: 210, color: '#fff', size: '3px', position: 'left', touchScrollStep: 100 });

		  //       // If a chat user is clicked show the chat talk
		  //       $('a', chatUsers).click(function(){
		  //           chatUsers.slideUp();
		  //           chatTalk.slideDown();
		  //           chatInput.focus();

		  //           return false;
		  //       });

		  //       // If chat talk close button is clicked show the chat user list
		  //       $('#chat-talk-close-btn').click(function(){
		  //           chatTalk.slideUp();
		  //           chatUsers.slideDown();

		  //           return false;
		  //       });

		  //       // When the chat message form is submitted
		  //       $('#sidebar-chat-form').submit(function(e){
		  //           // Get text from message input
		  //           chatMsg = chatInput.val();

		  //           // If the user typed a message
		  //           if (chatMsg) {
		  //               // Add it to the message list
		  //               chatMessages.append('<li class="chat-talk-msg chat-talk-msg-highlight themed-border animation-slideLeft">' + $('<div />').text(chatMsg).html() + '</li>');

		  //               // Scroll the message list to the bottom
		  //               chatMessages.animate({ scrollTop: chatMessages[0].scrollHeight}, 500);

		  //               // Reset the message input
		  //               chatInput.val('');
		  //           }

		  //           // Don't submit the message form
		  //           e.preventDefault();
		  //       });
				// // Chatui directive logic
				// // ...
			}
		};
	}
]);
'use strict';

// Chats controller
angular.module('chats').controller('ChatsController', ['$scope', '$http', '$element' , '$stateParams', '$location', '$timeout', 'Authentication', 'Socket', 'Chats', 'Users',
	function($scope, $http, $element , $stateParams, $location, $timeout , Authentication, Socket, Chats, Users ) {
		$scope.authentication = Authentication;
		$scope.userChatFrom = $scope.authentication.user;
		$scope.chatConversation = {};
		$scope.userChatTo = undefined;	
		$scope.chatIsNew = false;

		Socket.on('chat.reciveMessage', function(data){
			if(!$scope.chatConversation)
				$scope.chatConversation={};
			if(!$scope.chatConversation.individualChatUsers){
				$scope.chatConversation.individualChatUsers = [];
				$scope.chatConversation.individualChatUsers.push({user: $scope.userChatFrom._id});
				$scope.chatConversation.individualChatUsers.push({user: $scope.userChatTo._id});
			}
					

			if(!$scope.chatConversation.chat)
					$scope.chatConversation.chat = [];
			
			if($scope.authentication.user._id === data.userToSee){
				// $scope.chatConversation.chat.push(data);
				var theUser ={ from : $scope.userChatFrom._id, to: $scope.userChatTo._id };
				$http.post('/chats/getConversationChat' , theUser ).success(function(response){
					$scope.chatIsNew = false;
					$scope.chatConversation = response[0];
					
					angular.forEach($scope.chatConversation.chat, function(chat){
						angular.forEach(response, function(res){

						});
					});
					var num = response.length;
					if (num  < 1 ){
						$scope.chatIsNew = true;
					}
				}).error(function(errorResponse){

				});
			}
		});

		// Create new Chat individual conversation
		$scope.createChatIndividualConversation = function( ) {
			// Create new Chat object
			var chat = new Chats ($scope.chatConversation);

			// Redirect after save
			chat.$save(function(response) {
				$scope.chatConversation._id = response._id;
				// Clear form fields

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Create new Chat individual conversation
		$scope.create = function() {
			// Create new Chat object
			var chat = new Chats ($scope.chatConversation);

			// Redirect after save
			chat.$save(function(response) {
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Chat
		// $scope.remove = function( chat ) {
		// 	if ( chat ) { chat.$remove();

		// 		for (var i in $scope.chats ) {
		// 			if ($scope.chats [i] === chat ) {
		// 				$scope.chats.splice(i, 1);
		// 			}
		// 		}
		// 	} else {
		// 		$scope.chat.$remove(function() {
		// 			$location.path('chats');
		// 		});
		// 	}
		// };

		// Update existing Chat individual conversation
		$scope.update = function() {
			var chat = new Chats( $scope.chatConversation);

			chat.$update(function() {
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Update existing Chat individual conversation
		$scope.updateTextConversation = function() {
			var chat = $scope.chat ;

			chat.$update(function() {
				$location.path('chats/' + chat._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//socket io users connected
		Socket.on('notify.chatusersconnected', function(users){
			$scope.usersConnected= [];
			angular.forEach(users, function(user){
				$scope.usersConnected.push(user);	
			});
		});	

		// Find a list of Chats
		$scope.find = function() {
			$http.post('/chats/listUserSession').success(function(response){
			}).error(function(errorResponse){
			});

			$scope.chats = Chats.query();
		};

		// Find existing Chat
		$scope.findOne = function() {
			$scope.chat = Chats.get({ 
				chatId: $stateParams.chatId
			});
		};

		$scope.onClickUserChat = function(user){

			if(user._id !== $scope.userChatFrom._id){
				var width = $element.parent().parent().parent().parent().find('#main-container').width();
				$scope.msgSmartNotification('','Espere un momento, cargando conversación.','fa fa-clock-o','#1c86e8', width+'', 100);

				$scope.chatConversation = {};
				$scope.userChatTo = user;
				var theUser ={ from : $scope.userChatFrom._id, to: $scope.userChatTo._id };
				$scope.showChatUser = true;	
				$http.post('/chats/getConversationChat' , theUser ).success(function(response){
					$scope.chatIsNew = false;
					$scope.chatConversation = response[0];
					var num = response.length;
					if (num  < 1 ){
						$scope.chatIsNew = true;
					}
				}).error(function(errorResponse){

				});
			}			
		};

		$scope.onCloseChat = function(){
			$scope.chatConversation = {};
			$scope.userChatTo = undefined;
			$scope.showChatUser = false;	
		};

		$scope.onKeypressChat = function(e){
			if(e.keyCode === 13){
				if(!$scope.chatConversation)
					$scope.chatConversation ={};
				if(!$scope.chatConversation.individualChatUsers){
					$scope.chatConversation.individualChatUsers = [];
					$scope.chatConversation.individualChatUsers.push({user: $scope.userChatFrom._id});
					$scope.chatConversation.individualChatUsers.push({user: $scope.userChatTo._id});
				}
				

				if(!$scope.chatConversation.chat){
					$scope.chatConversation.chat = [];
				}

				var newMessage = {
					userWrote : $scope.userChatFrom._id,
					userToSee : $scope.userChatTo._id,
					text : $scope.textToSend
				};

				$scope.chatConversation.chat.push(newMessage);
				if($scope.chatIsNew){
					$scope.createChatIndividualConversation();
				}else{
					$scope.update();
				}
			}
		};

		//SmartNotifications
		$scope.msgSmartNotification = function( title,  content, icon, color, time){
			if (!time) {
				time = 1000;
			}
			$scope.msgTitle = title;
			$scope.msgContent = content;
			$scope.msgIcon = icon;
			$scope.msgColor = color;

			$scope.isOk = true;	
			$timeout(function () {
            	$scope.isOk = undefined;
        	},time);
		};

	}
]);
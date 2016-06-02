angular.module('az-web-app')
    .controller('ChatController', function($rootScope, $state, $scope, Usuario) {
        $scope.chatrooms = [];
        
        loadChatRooms();
        
        function loadChatRooms() {
            Usuario.chatrooms({
                id: localStorage.getItem('$LoopBack$currentUserId'),
                filter: {
                    include: 'users'
                }
            }).$promise
                .then(function(chatrooms) {
                    $scope.chatrooms = chatrooms;
                    console.log(chatrooms);

                    $state.go('base.app.chat.result', {chatroom: chatrooms[0].id})
                });
        }
    });
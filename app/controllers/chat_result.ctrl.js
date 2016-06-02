angular.module('az-web-app')
    .controller('ChatResultController', function ($rootScope, $scope, $stateParams, $timeout, Usuario, Chatroom, Chatmessage) {
        var roomId = $stateParams.chatroom;
        $scope.me  = localStorage.getItem('$LoopBack$currentUserId');       
        
        Chatroom.prototype$updateAttributes({id: roomId}, {
            unread: false
        }).$promise
            .then(function(chatroom) {
                console.log('CHATROOM', chatroom);
                $('.messages').removeClass('yellow');
                $rootScope.unreadRooms = [];
                localStorage.removeItem('unread_rooms');
            });       
        
        console.log('After class');

        $scope.messages = [];

        getMessages();

        $scope.sendMessage = function () {

            Chatmessage.create({
                text      : $scope.data.text,
                chatroomId: $stateParams.chatroom,
                usuarioId : $rootScope.user.id
            }, function (data) {
                console.log(data);
                getMessages();
            })

        };

        function getMessages() {
            Chatroom.messages({
                id    : roomId,
                filter: {
                    include: 'user'
                }
            }).$promise
                .then(function (messages) {
                    $scope.messages = messages;
                    console.log(messages);

                    $timeout(function() {
                        var overflow = $('#chat');
                    overflow[0].scrollTop = overflow[0].scrollHeight;
                    }, 0)
                });
        }

        $scope.$on('new-message-received', function(e, data) {
            console.log(e, data);
            if (data.content.chatroomId == roomId) {
                $scope.$apply(function() {
                    $scope.messages.push(data.content);
                    $timeout(function() {
                        var overflow = $('#chat');
                    overflow[0].scrollTop = overflow[0].scrollHeight;
                    }, 0)
                })
            }
        })
    });
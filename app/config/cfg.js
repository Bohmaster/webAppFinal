angular.module('az-web-app')
    .run(function ($rootScope, $http, $state, ngFB, Usuario) {

        console.log('RUNNNNNNNNNNNNNNNNNNNNNNN');
        var API_URL = 'http://104.131.113.114:3004/api/';

        $rootScope.$on('$viewContentLoaded', function (event) {
            console.log('route changed');
            //Webflow.ready();

            var unread_rooms = JSON.parse(localStorage.getItem('unread_rooms'));
            if (unread_rooms) {
                $rootScope.unreadRooms = unread_rooms;
                $('.messages').addClass('yellow');
                console.log('UNREAD_ROOMS')
            }
        });

        $rootScope.$on('$stateChangeStart', function (e, toState) {
            console.log('STATE STARTTTTTTTTTTTTTTTTTT', $rootScope.unreadRooms);
            var user = JSON.parse(localStorage.getItem('user'));

            if (user) {
                $rootScope.user = user;
            }

        });

        var userId      = localStorage.getItem('$LoopBack$currentUserId');
        var accessToken = localStorage.getItem('$LoopBack$accessTokenId');

        $rootScope.unreadRooms = [];

        // busco los chatrooms del user logueado
        $http.get(API_URL + 'usuarios/' + userId + '/chatrooms?filter=%7B"where"%3A%7B"unread"%3Atrue%7D%7D&access_token=' + accessToken)
            .success(function (rooms) {

                console.log('ROOOMs', rooms);

                for (var i = 0; i < rooms.length; i++) {
                    if (rooms[i].last_message_by != String(userId)) {
                        if ($rootScope.unreadRooms.indexOf(rooms[i].chatroomId) == -1) {
                            $rootScope.unreadRooms.push(rooms[i].id);
                            localStorage.setItem('unread_rooms', JSON.stringify($rootScope.unreadRooms));
                        }
                    }
                }

                if ($rootScope.unreadRooms.length) {
                    console.log('LENGHT');
                    $(".messages").addClass("yellow");
                }

                console.log($rootScope.unreadRooms);

            })
            .error(function (err) {
                console.error(err);
            });

        // socket
        var socket = io.connect('http://104.131.113.114:3004');

        socket.on('connect', function (aa) {
            socket.emit('authentication', {id: accessToken, userId: userId});
        });

        socket.authenticate = function () {
            socket.emit('authentication', {id: accessToken, userId: userId});
        };

        socket.on('unauthorized', function (err) {
            console.log("There was an error with the authentication:", err.message);
        });

        socket.on('authenticated', function (result) {
            if (result) {
                console.log(result, userId, $state);

                socket.on(userId, function (data) {
                    console.log('Server Signal:', data);

                    switch (data.type) {
                        case 'message':
                        case 'suggestion':

                            if (
                                data.content.usuarioId != userId &&
                                ($state.current.name != "base.app.chat.result" ||
                                ($state.current.name == "base.app.chat.result" && $state.params.chatroom != data.content.chatroomId))
                            ) {

                                if ($rootScope.unreadRooms.indexOf(data.chatroomId) == -1) {
                                    $rootScope.unreadRooms.push(data.content.chatroomId);
                                    $(".messages").addClass("yellow");
                                }

                            } else {
                                console.log('alla');
                            }

                            $rootScope.$broadcast('new-message-received', data);
                            //$state.reload();

                            break;
                    }

                });
            }
        });

        ngFB.init({appId: '1635919233357054'});
    });
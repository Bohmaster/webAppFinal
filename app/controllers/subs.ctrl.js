angular
    .module('az-web-app')
    .controller('SubsController', function ($rootScope, $scope, $http, Usuario, Entity) {

        $scope.entities = [];

        loadAllTheThings();

        function loadAllTheThings() {

            var array = [];

            var URL_CONSTRUCT = 'http://104.131.113.114:3004/api/usuarios/' + $rootScope.user.id + '/likes';

            $http.get(URL_CONSTRUCT)
                .success(function(likes) {
                    for (like in likes) {
                        console.log(2, likes);
                        Entity.find({
                            filter: {
                                where: {
                                    id: likes[like].likedObjectId
                                }
                            }
                        }).$promise.then(function(entities) {
                            console.log(1, entities);
                            array.push(entities);
                            angular.copy(array, $scope.entities)
                        })
                    }
                });

        }

    });
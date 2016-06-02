angular
    .module('az-web-app')
    .controller('HomeController', function ($rootScope, $window, $scope, Entity, Advert, Usuario) {
        $scope.entities = [];
        $scope.adverts  = [];

        $scope.directions = [];

        $scope.result = [];

        Entity.find({
          filter: {
            order: 'ranking DESC'
          }
        }, function(data) {
          for (var i = 0; i < data.length; i++) {
            console.log(data[i].ranking, data[i].name);
          }
        });

        Usuario.login({
            username: "martin",
            password: "martineto"
        }, function (result) {
            console.log(result);
            $rootScope.user = result.user;

            $window.localStorage.setItem('user', JSON.stringify(result.user));

        });

        getEntities();
        getAdverts();

        function getEntities() {
            Entity.find({
                filter: {
                    limit: 4,
                    where: {
                        categoryId: '55eeed7c4a56ca5c65ad3ca9'
                    }
                },
                order : 'id DESC'
            }).$promise
                .then(function (data) {
                    $scope.entities = data;
                    console.log(data);
                });
            Entity.find({
                filter: {
                    where: {
                        active: true
                    }
                },
                order : 'id DESC'
            }).$promise
                .then(function (data) {
                    angular.forEach(data, function (entity) {
                        var _obj     = {};
                        _obj.address = entity.address;
                        _obj.name    = entity.name;

                        $scope.directions.push(_obj);
                    });
                });
        }

        function getAdverts() {
            Advert.find({
                filter: {
                    order: 'creation_date DESC',
                    limit: 4
                }
            }).$promise
                .then(function (data) {
                    $scope.adverts = data;
                    console.log(data);
                });
        }
    });

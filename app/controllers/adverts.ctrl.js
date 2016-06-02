angular
    .module('az-web-app')
    .controller('AdvertsController', function($scope, Advert) {

        getAdverts();

        function getAdverts() {
            Advert.find({
                filter: {
                    order: 'creation_date DESC',
                    limit: 15
                }
            }).$promise
                .then(function(data) {
                    $scope.adverts = data;
                    console.log(data);
                });
        }
        
    });
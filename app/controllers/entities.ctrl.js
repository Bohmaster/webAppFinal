angular.module('az-web-app')
    .controller('EntitiesController', function($scope, $stateParams, $state, Entity, Category) {
        
        $scope.entities = [];
        
        console.log(1, $stateParams);

        $scope.$on('fetch:sub-entities', function(event, data) {
            console.log(event);
            getEntities(data.id);
        });

        getDefaultEntities();

        if ($stateParams.category) {
            getEntities($stateParams.category);
            console.log('main');
        } 
        
        if ($stateParams.subcategory) {
            getEntities($stateParams.subcategory);
            console.log('sub');
        }
            
        function getEntities(id) {
            console.log('running');
            Category.find({                
                filter: {
                    include: "entities",
                    where: {
                        id: id
                    }
                }})
                .$promise
                .then(function(data) {
                    console.log('DATA', data[0]);
                    $scope.entities = data[0].entities;
                    console.log($scope.entities);
                });
        
        }

        function getDefaultEntities() {
            console.log('running');
            Category.find({
                    filter: {
                        include: "entities",
                        where: {
                            id: "55eeed7c4a56ca5c65ad3ca9"
                        }
                    }})
                .$promise
                .then(function(data) {
                    console.log('DATA', data[0]);
                    $scope.entities = data[0].entities;
                    console.log($scope.entities);
                });

        }

    });
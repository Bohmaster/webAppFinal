angular.module('az-web-app')
    .controller('SubEntitiesController', function($scope, $stateParams, Entity, Category) {
        
        $scope.entities = [];
        
        console.log(1, $stateParams);

        getEntities($stateParams.subcategory);
            
        function getEntities(id) {
            Category.findById({
                id: id,
                filter: {
                    include: "entities"
                }})
                .$promise
                .then(function(data) {
                    $scope.entities = data.entities;                    
                    console.log($scope.entities);
                });
        
        }       

    });
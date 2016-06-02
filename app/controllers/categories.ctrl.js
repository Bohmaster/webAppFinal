angular.module('az-web-app')
    .controller('CategoriesController', function($rootScope, $scope, $state, $stateParams, Entity, Category) {
        
        $scope.categories = [];
        $scope.currentCategoryId = "55bd5511a2db96570829f6ce";
        
        getCategories();
        
        $scope.clicked = 0;        
        $scope.showSub = function(id) {
            $scope.clicked = id;
        };

        $scope.setCategory = function(categoryId) {
            $scope.currentCategoryId = categoryId;
            console.log($scope.currentCategoryId);
        };

        $scope.getSubEntities = function(id) {
            $rootScope.$broadcast('fetch:sub-entities', {id: id});
            console.log('sub-entities');
        };
        
        function getCategories() {
            Category.__get__root({
                filter: {
                    include: "subcategories"
                }})
                .$promise
                .then(function(data) {
                    $scope.categories = data;                    
                    console.log($scope.categories);
                });
        }
        
    });
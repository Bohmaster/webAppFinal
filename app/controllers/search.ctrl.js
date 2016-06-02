angular
    .module('az-web-app')
    .controller('SearchController', function($scope, $stateParams, Category, Entity) {
        var query = $stateParams.query;
        $scope.query = query;
        
        $scope.results = [];
        
        getResults();
        
        function getResults() {
            Entity.find({
              filter: {
                  where: {
                      name: {
                          like: query + ".*" , options:"i"
                      }
                  },
                  include: ['subdomain','adverts','owners','city']
                }
            }).$promise
                .then(function(results) {
                    $scope.results = results;
                    console.log(results);
                });
        }
        
    });
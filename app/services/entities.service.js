(function() {
    'use strict';

    angular
        .module('az-web-app')
        .factory('EntityService', EntityService);

    EntityService.$inject = ['Entity', '$localstorage', '$http', 'ProjectSettings'];

    /* @ngInject */
    function EntityService(Entity, $localstorage, $http, ProjectSettings) {
        var service = {
            like: like,
            rank: rank
        };

        return service;

        function like(entity, userId) {
          if(entity.userLikes) {
            // el link entre entidad y usuario ya existe, hay que actualizarlo
            $http.delete(
              ProjectSettings.apiUrl + "/entities/" + entity.id + "/likes/" + entity.userLikesId
            ).then(function(res) {
              return {
                'userLikes': false,
                'userLikesId': undefined,
                'totalLikes': entity.totalLikes!==undefined?entity.totalLikes--:0
              };
            }, function(err) {
              return { 'err': err };
            });

          } else {
            // el link no existe, hay que crearlo
            Entity.prototype$__create__likes(
              {'id': entity.id},
              { "likedObjectType": "entity",
                "usuarioId": userId
              },
              function(res,headers) {
                return {
                  'userLikes': true,
                  'userLikesId': res.id,
                  'totalLikes': entity.totalLikes!==undefined?entity.totalLikes++:1
                };
              }, function(err){
                return { 'err': err };
              });
          }
        }

        function rank(entity, userId, value) {
          if(entity.userRanks) {
            // el link entre entidad y usuario ya existe, hay que actualizarlo
            $http.put(
              ProjectSettings.apiUrl + "/entities/" + entity.id + "/ranks/" + entity.userRanksId,
              {"value":value}
            ).then(function(res) {
              if(res.status===200) {
                return {
                  value: res.data.value,
                  id: res.data.id
                };
              }
            }, function(err) {
              return { 'err': err };
            });

          } else {
            // el link no existe, hay que crearlo
            Entity.prototype$__create__ranks(
              {'id': entity.id},
              { "value": value,
                "rankedObjectType": "entity",
                "usuarioId": userId
              },
              function(res,headers) {
                return {
                  value: res.value,
                  id: res.id
                };
              }, function(err){
                return { 'err': err };
              });
          }

        }
    }
})();

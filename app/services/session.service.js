angular
  .module('az-web-app')
  .service('SessionService', function($q, Usuario) {


    var logout = function() {
      return $q(function(resolve, reject) {
        Usuario.logout(
          function(success) {
            resolve(success);
          }, function(err) {
            reject(err);
          }
        );
          // var name = $rootScope.currentUser.name?$rootScope.currentUser.name:'';
          // var alertPopup = $ionicPopup.alert({
          //     title: 'AZ Club',
          //     subTitle: name?' saliste':'Saliste' + ' de la aplicación',
          //     template: '<p style="text-align:center;font-weight:700;">No te pierdas los beneficios de estar registrado en AZ!</p>',
          //     cssClass: 'dark'
          // });
          // alertPopup.then(function (res) {
          //   $rootScope.currentUser = null;
          //   $location.path('app');
          // });
      });
    };

    var login = function(credentials) {
      return $q(function(resolve, reject) {
        Usuario.login({include: ['user','entity'], rememberMe: true}, credentials)
        .$promise.then(
          function (response) {
            resolve(response);
            // if(response.user.owner) {
            //   Entity.findById( {id: response.user.entityId}, function(entity,res){
            //     console.log(entity);
            //     if(!entity.active) {
            //       $ionicPopup.alert({
            //           title: 'AZ Club',
            //           subTitle: 'Problemas de login!',
            //           template: '<p style="text-align:center;font-weight:700;">Usuario desactivado!</p>',
            //           cssClass: 'dark'
            //       });
            //     }
            //   }, function(err){
            //     console.log(err);
            //   });
            // }
          },
          function (err) {
            reject(err);
          }
        );
      });
    };

    var register = function(credentials) {
      return $q(function(resolve, reject) {
        Usuario.create(credentials)
          .$promise
          .then(function (response) {
            Usuario.login({include: 'user', rememberMe: true}, credentials)
              .$promise
              .then(function (res) {
                  resolve(res);
              }, function (err) {
                  reject(err);
              });
          },
          function (err) {
            reject(err);
          }
        );
      });
    };

    var setUser = function(user_data) {
      window.localStorage.starter_facebook_user = JSON.stringify(user_data);
    };

    var getUser = function(){
      return JSON.parse(window.localStorage.starter_facebook_user || '{}');
    };

    return {
      login: login,
      logout: logout,
      register: register,
      getUser: getUser,
      setUser: setUser
    };
  });

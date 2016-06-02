angular
  .module('az-web-app')
  .controller('LoginCtrl', function($scope, $rootScope, Toast, $location, SessionService, Usuario, ngFB) {

    $scope.credentials = {};
    $scope.registration = {};

    /**
     * Metodos para login y registro de usuarios AZ
     */

    $scope.login = function (user_credentials) {

      if(user_credentials) {
        $scope.credentials.username = user_credentials.username;
        $scope.credentials.password = user_credentials.password;
      }

      SessionService.login($scope.credentials).then(function(response) {
        if(response.user.entity && !response.user.entity.active) {
          console.log('error');
        } else {

          $scope.credentials = {};
          $rootScope.$broadcast('user-logged',{data: response.user});
          $location.path('/base');
        }
      }, function(err) {
        if(user_credentials) {
          $scope.register(user_credentials);
        } else {
          if (err.data.error.code==="LOGIN_FAILED") {
            Toast.show("Error. Por favor chequeá tu usuario y contraseña.");
          }
        }
      });

    };

    $scope.register = function (user_social) {

      if(user_social) {
        $scope.registration = user_social;
      }

      $scope.registration.createdDate = new Date().toJSON();

      SessionService.register($scope.registration).then(function(response) {
        Toast.show('Bienvenido a AZ!');
        $rootScope.$broadcast('user-logged',{data: response.user});
        $location.path('/');
      }, function(err) {
        var message,title;
        if(err.data.error.status===422) {
          title = "Error de validación";
          message = "Alguno de los datos es erroneo. Quizás el email ingresado ya está siendo usado en el sistema.";
        } else {
          title = err.statusText;
          message = err.data.error.message;
        }
        Toast.alert({
            title: title,
            template: message
        });
      });
    };

    /**
     * Metodos para login y registro con openFB
     */

     $scope.openFacebookLogin = function () {

       console.log('trying to loggin');

       ngFB.login({scope: 'email,public_profile'}).then(
         function (response) {
           if (response.status === 'connected') {
             var tokenfb = response.authResponse.accessToken;
             $scope.me( function(user_data) {
               if(!user_data.email) {
                 alert("Error, cannot retrieve user email from Facebook");
               } else {
                 //console.log(user_data);
                 // we'll create a custom password for the new social oauth user
                 // facebook_user_id + '.' + email + '#_@' + social_facebook_oauth_az.login
                 var new_user = {
                   "email": user_data.email,
                   "username": user_data.email,
                   "name": user_data.name,
                   "register_type": "facebook",
                   "facebook": { "id": user_data.id, "token": tokenfb },
                   "password": user_data.id + '.' + user_data.email + '#_@' + "social_facebook_oauth_az.login",
                   "picture": user_data.picture.data.url
                 };
                 $scope.login(new_user);
               }
             });

             // $scope.closeLogin();
           } else {
             console.error("Error en login facebook");
             Toast.show('Error en intento de login con Facebook');
           }
         }
       );
     };

     $scope.me = function(cb) {
       ngFB.api({
         path: '/me',
         params: {fields: 'id,name,email,picture'}
       }).then(
         function (user) {
           cb(user);
         },
         function (error) {
           //console.log('Facebook error: ' + error.error_description);
         });
     };

    /**
     * Facebook cordova plugin for native facebook login
     */

    //This is the success callback from the login method
    var fbLoginSuccess = function(response) {
      if (!response.authResponse){
        fbLoginError("Cannot find the authResponse");
        return;
      }

      var authResponse = response.authResponse;
      //console.log(authResponse);
      getFacebookProfileInfo(authResponse)
      .then(function(profileInfo) {
        //console.log(profileInfo);
        //for the purpose of this example I will store user data on local storage
        SessionService.setUser({
          authResponse: authResponse,
  				userID: profileInfo.id,
  				name: profileInfo.name,
  				email: profileInfo.email,
          picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
        });

        $ionicLoading.hide();
        $location.path('/');

      }, function(fail){
        //fail get profile info
        //console.log('profile info fail', fail);
      });
    };


    //This is the fail callback from the login method
    var fbLoginError = function(error){
      console.log('fbLoginError', error);      
    };

    //this method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
      var info = $q.defer();

      facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
        function (response) {
  				//console.log(response);
          info.resolve(response);
        },
        function (response) {
  				//console.log(response);
          info.reject(response);
        }
      );
      return info.promise;
    };

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {

      facebookConnectPlugin.getLoginStatus(function(success){
       if(success.status === 'connected'){
          // the user is logged in and has authenticated your app, and response.authResponse supplies
          // the user's ID, a valid access token, a signed request, and the time the access token
          // and signed request each expire
          //console.log('getLoginStatus', success.status);

  				//check if we have our user saved
  				var user = SessionService.getUser('facebook');

  				if(!user.userID) {

  					getFacebookProfileInfo(success.authResponse)
  					.then(function(profileInfo) {

  						//for the purpose of this example I will store user data on local storage
  						UserService.setUser({
  							authResponse: success.authResponse,
  							userID: profileInfo.id,
  							name: profileInfo.name,
  							email: profileInfo.email,
  							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
  						});

  						$location.path('/');

  					}, function(fail){
  						//fail get profile info
  						//console.log('profile info fail', fail);
  					});
  				}else{
  					$location.path('/');
  				}

       } else {
          //if (success.status === 'not_authorized') the user is logged in to Facebook, but has not authenticated your app
          //else The person is not logged into Facebook, so we're not sure if they are logged into this app or not.
          //console.log('getLoginStatus', success.status);

  			  Toast.show({
            template: 'Logging in...'
          });

          //ask the permissions you need. You can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
          facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
        }
      });
    };
  });

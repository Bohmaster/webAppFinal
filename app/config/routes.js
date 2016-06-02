angular.module('az-web-app')
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/base/');
        
        $stateProvider
            .state('base', {
                url: '/base',
                abstract: true,
                templateUrl: 'app/views/base.html'
            })
            .state('base.home', {
                url: '/',
                templateUrl: 'app/views/home.html',
                controller: "HomeController"
            })
            .state('base.app', {
                url: '/app',
                templateUrl: 'app/views/app/main.html',
            })
            .state('base.app.entities', {
                url: '/entities',
                templateUrl: 'app/views/app/entities.html',
                controller: 'CategoriesController'
            })
            .state('base.app.entities.categories', {
                url: '/:category/',
                templateUrl: 'app/views/app/entities_result.html',
                controller: 'EntitiesController'
            })
            .state('base.app.entities.subcategories', {
                url: '/:subcategory/',
                templateUrl: 'app/views/app/entities_result.html',
                controller: 'EntitiesController'
            })
            .state('base.app.adverts', {
                url: '/novedades',
                templateUrl: 'app/views/app/adverts.html',
                controller: 'AdvertsController'
            })
            .state('base.app.subs', {
                url: '/subs',
                templateUrl: 'app/views/app/subs.html',
                controller: 'SubsController'
            })
            .state('base.app.chat', {
                url: '/chat',
                templateUrl: 'app/views/app/chat.html',
                controller: 'ChatController'
            })
            .state('base.app.chat.result', {
                url: '/:chatroom',
                templateUrl: 'app/views/app/chat_result.html',
                controller: 'ChatResultController'
            })
            .state('base.app.search', {
                url: '/search/:query',
                templateUrl: 'app/views/app/search.html',
                controller: 'SearchController'
            });                           
     });            
        


       
            
           
     
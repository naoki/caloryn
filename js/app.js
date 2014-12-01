'use strict';

var caloryn = angular.module('caloryn', [
    'ngRoute',
    'caloryn.controllers'
]);

caloryn.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'tpl/login.html',
                controller: 'loginController'
            }).
            when('/users/:userId', {
                templateUrl: 'tpl/user.html',
                controller: 'userController'
            }).
            when('/users/:userId/:dateId', {
                templateUrl: 'tpl/user.html',
                controller: 'userController'
            }).
            when('/users/:userId/:dateId/:mealSeq', {
                templateUrl: 'tpl/meals.html',
                controller: 'mealController'
            }).
            otherwise({
                redirectTo: '/login'
        });
    }]);



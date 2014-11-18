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
            when('/date', {
                templateUrl: 'tpl/date.html',
                controller: 'dateController'
            }).
            when('/meals/:mealId', {
                templateUrl: 'tpl/meals.html',
                controller: 'mealController'
            }).
            otherwise({
                redirectTo: '/login'
        });
    }]);



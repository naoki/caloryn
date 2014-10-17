'use strict';

var caloryn = angular.module('caloryn', ['ngRoute','angularLocalStorage']);

caloryn.controller('MessageCtrl', ['$scope', function($scope) {
    $scope.message = '';
    $scope.$on('errorMessage', function (e, data) {
        $scope.message = data;
    });
}]);


caloryn.controller('SearchCtrl', ['$scope', function ($scope) {
    $scope.search = function (value) {
        return "searching "+value;
    }
}]);

caloryn.controller('dataCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.data = [];
    $http({
        method: 'get',
        url: './js/data.json',
        withCredentials: true
    }).
    success(function (data) {
        $scope.data = data;
    }).
    error(function (data, status) {
        $rootScope.$broadcast('errorMessage', '通信中にエラーが発生しました')
    });
    $scope.click = function (data) {
        console.log(data);
    }
}]);


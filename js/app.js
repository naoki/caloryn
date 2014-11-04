'use strict';

var caloryn = angular.module('caloryn', ['ngRoute','angularLocalStorage']);

caloryn.controller('wrapperCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.searchText = '';
    $scope.checkDataArea = function () {
        $rootScope.$broadcast('filterUpdate', $scope.searchText);
    }
    $scope.$on('addItem', function (e, item) {
        $scope.searchText = '';
        $scope.checkDataArea();
    });
}]);

caloryn.controller('MessageCtrl', ['$scope', function($scope) {
    $scope.message = '';
    $scope.$on('errorMessage', function (e, data) {
        $scope.message = data;
    });
}]);

caloryn.controller('itemsCtrl', ['$scope', function ($scope) {
    $scope.items = [];
    $scope.totalResult = 0;
    $scope.remove = function (index) {
        $scope.items.splice(index, 1);
        $scope.resetTotalResult();
    }
    $scope.calc = function (index) {
        var data = $scope.items[index];
        data.result = Math.round(data.calory * data.gram);
        $scope.resetTotalResult();
    }
    $scope.resetTotalResult = function () {
        var x, len;
        $scope.totalResult = 0;
        for (x = 0, len = $scope.items.length; x < len; x++) {
            $scope.totalResult += $scope.items[x].result;
        }
    }
    $scope.$on('addItem', function (e, data) {
        $scope.items.push({
            "name": data.name,
            "gram": 0,
            "calory": data.calory,
            "result": 0
        });
    });
}]);

caloryn.controller('dataCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.searchText = $scope.$parent.searchText;
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
        $rootScope.$broadcast('addItem', data);
    }
    $scope.$on('filterUpdate', function (e, text) {
        $scope.searchText = text;
    });
}]);


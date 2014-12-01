
var calorynControllers = angular.module('caloryn.controllers', [
    'angularLocalStorage',
    'ui.bootstrap'
]);

// login
calorynControllers.controller('loginController', [
    '$scope', '$rootScope', '$location', 'storage',
    function ($scope, $rootScope, $location, storage) {
        var user = storage.get('user');
        if (!user) {
            var timestamp = Math.round((new Date()).getTime() / 1000);
            var ShaObj = new jsSHA(timestamp, "TEXT");
            var hash = ShaObj.getHash("SHA-256", "HEX");
            storage.set('user', hash);
            user = hash;
        }
        $location.path('/users/'+user);
    }

]);


// user
calorynControllers.controller('userController', [
    '$scope', '$rootScope', '$location', 'storage',
    function ($scope, $rootScope, $location, storage) {
        var current = new Date();
        $scope.year = current.getFullYear();
        $scope.month = current.getMonth() + 1;
        $scope.date = current.getDate();
        $scope.curDate = $scope.year + ('0'+$scope.month).slice(-2) + ('0'+$scope.date).slice(-2);
        var user = storage.get('user');
        storage.bind($scope, 'meals');

        $scope.meals = {};
        $scope.meals[$scope.curDate] = {
                1: true,
                2: false,
                3: true,
                4: false,
                5: true,
                6: false
            };

        $scope.hasActive = function (num) {
            return ($scope.meals[$scope.curDate][num]) ? 'info': '';
        }

        $scope.editMeal = function (num) {
            $location.path('/users/'+user+'/'+$scope.curDate+'/'+num);
        }
    }
]);

calorynControllers.controller('mealController', [
    '$scope', '$rootScope',
    function ($scope, $rootScope) {
        // meal
    }
]);


/*

calorynControllers.controller('wrapperCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.searchText = '';
    $scope.checkDataArea = function () {
        $rootScope.$broadcast('filterUpdate', $scope.searchText);
    }
    $scope.$on('addItem', function (e, item) {
        $scope.searchText = '';
        $scope.checkDataArea();
    });
}]);

calorynControllers.controller('MessageCtrl', ['$scope', function($scope) {
    $scope.message = '';
    $scope.$on('errorMessage', function (e, data) {
        $scope.message = data;
    });
}]);

calorynControllers.controller('itemsCtrl', ['$scope', function ($scope) {
    $scope.items = [];
    $scope.totalWeight  = 0;
    $scope.totalProtain = 0;
    $scope.totalCalory  = 0;
    $scope.remove = function (index) {
        $scope.items.splice(index, 1);
        $scope.resetTotalResult();
    }
    $scope.calc = function (index) {
        var data = $scope.items[index];
        data.itemProtain = Math.round(data.protain * data.gram);
        data.itemCalory  = Math.round(data.calory * data.gram);
        $scope.resetTotalResult();
    }
    $scope.resetTotalResult = function () {
        var x, len;
        $scope.totalWeight  = 0;
        $scope.totalProtain = 0;
        $scope.totalCalory  = 0;
        for (x = 0, len = $scope.items.length; x < len; x++) {
            $scope.totalWeight += $scope.items[x].gram;
            $scope.totalProtain += $scope.items[x].itemProtain;
            $scope.totalCalory  += $scope.items[x].itemCalory;
        }
    }
    $scope.$on('addItem', function (e, data) {
        $scope.items.push({
            "name": data.name,
            "gram": 0,
            "protain": data.protain,
            "calory": data.calory,
            "itemCalory": 0,
            "itemProtain": 0
        });
    });
}]);

calorynControllers.controller('dataCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.searchText = $scope.$parent.searchText;
    $scope.data = [];
    $http({
        method: 'get',
        url: './data/data.json',
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
*/

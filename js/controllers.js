
var calorynControllers = angular.module('caloryn.controllers', [
    'angularLocalStorage',
    'ui.bootstrap'
]);

// login
calorynControllers.controller('loginController', [
    '$scope', '$location', 'storage',
    function ($scope,  $location, storage) {
        var user = storage.get('user');
        if (!user) {
            var hash = $com.auth.makeHash();
            storage.set('user', hash);
            user = hash;
        }
        $scope.current_date = $com.date.getCurrentStr();
        $location.path('/users/'+user+'/'+$scope.current_date);
    }
]);


// date
calorynControllers.controller('dateController', [
    '$scope', '$location', 'storage', 'userData',
    function ($scope, $location, $storage, $userData) {
        var path = $location.path();
        var user = $com.func.getUser($storage);
        $scope.current_date = $com.format.interpretPath(path).dateId;
        var dt = $com.format.splitDate($scope.current_date);
        $scope.month = dt.month;
        $scope.date  = dt.date;
        var data = $userData.getAll();
        if (_.isUndefined(data[$scope.current_date]) === true) {
            data = $com.func.dateInitialize(data, $scope.current_date);
            $storage.set("data", data);
        }
        var calories = [];
        _.map(data[$scope.current_date].summary, function (val, key) {
            calories[key] = val.calorie;
        });
        $scope.meals = calories;

        $scope.isDone = function (num) {
            return ($scope.meals[num] > 0) ? 'menu-done':'menu-yet';
       }

        $scope.editMeal = function (num) {
            $location.path('/users/'+user+'/'+$scope.current_date+'/'+num);
        }
    }
]);

calorynControllers.controller('mealController', [
    '$scope', '$http', '$location', 'storage', 'userData', '$q',
    function ($scope, $http, $location, $storage, $userData, $q) {
        $scope.searchText = '';
        $scope.message = '';
        var paths = $com.format.interpretPath($location.path());
        $scope.items = [];
        $scope.totalWeight  = 0;
        $scope.totalProtain = 0;
        $scope.totalCalory  = 0;
        $scope.data = [];

        $http({
            method: 'get',
            url: './data/data.json',
            withCredentials: true
        }).
        success(function (data) {
            $scope.ingredientsData = data;
        }).
        error(function (data, status) {
            console.log(status);
        });

        // サジェストアイテム表示制御
        $scope.isDataVisible = function () {
            return ($scope.searchText == '');
        }

        // アイテム追加
        $scope.addItem = function (data) {
            $scope.items.push({
                "id": data.id,
                "name": data.name,
                "gram": 0,
                "protain": data.protain,
                "calorie": data.calorie,
                "itemCalory": 0,
                "itemProtain": 0
            });
            $scope.searchText = '';
        }

        // データ保存
        $scope.saveAll = function () {
            var data = {};
            var summary = {};
            data[paths.mealId] = [];
            var result = {};
            _.map($scope.items, function (val, key) {
                data[paths.mealId].push({
                    "id": val.id,
                    "gram": val.gram
                });
            });
            summary[paths.mealId] = {
                "calorie" : $scope.totalCalory,
                "protain": $scope.totalProtain,
                "weight" : $scope.totalWeight
            };
            result[paths.dateId] = {
                "detail": data,
                "summary": summary
            };
            $storage.set("data", result);
        }

        // トータル値の再計算
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

        // 入力データ削除
        $scope.itemRemove = function (index) {
            $scope.items.splice(index, 1);
            $scope.resetTotalResult();
        }

        // データ更新
        $scope.itemCalc = function (index) {
            var data = $scope.items[index];
            data.itemProtain = Math.round(data.protain * data.gram);
            data.itemCalory  = Math.round(data.calorie * data.gram);
            $scope.resetTotalResult();
        }

    }
]);


'use strict';

var ingredge = angular.module('ingredge', [
    'ngRoute',
    'ingredge.controllers'
]);

ingredge.factory('userData', [
    '$rootScope', 'storage',
    function ($rootScope, $storage) {
        var data = $storage.get('data');
        if (_.isNull(data) === true) {
            data = {};
        }
        return {
            getAll: function () {
                return data;
            },
            getSummary: function (dateId) {
                if (_.isUndefined(data[dateId]) === false) {
                    if (_.isUndefined(data[dateId].summary) === false) {
                        return data[dateId].summary;
                    }
                }
                return undefined;
            },
            getDetail: function (dateId, mealId) {
                if (_.isUndefined(data[dateId]) === false) {
                    if (_.isUndefined(data[dateId].detail) === false) {
                        if (_.isUndefined(data[dateId].detail[mealId]) === false) {
                            return data[dateId].detail[mealId];
                        }
                    }
                }
                return undefined;
            }
        };
    }
]);

ingredge.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'tpl/login.html',
                controller: 'loginController'
            }).
            when('/users/:userId/:dateId', {
                templateUrl: 'tpl/date.html',
                controller: 'dateController'
            }).
            when('/users/:userId/:dateId/:mealSeq', {
                templateUrl: 'tpl/meals.html',
                controller: 'mealController'
            }).
            otherwise({
                redirectTo: '/login'
            });
    }
]);

var $com = {
    data: null,
    current: {
        user: null,
        date: null
    },
    func: {
        getUser: function (storage) {
            return storage.get('user');
        },
        dateInitialize: function (data, date) {
            data[date] = {
                summary: [
                    { "calorie": 0, "protein": 0, "weight" : 0},
                    { "calorie": 0, "protein": 0, "weight" : 0},
                    { "calorie": 0, "protein": 0, "weight" : 0},
                    { "calorie": 0, "protein": 0, "weight" : 0},
                    { "calorie": 0, "protein": 0, "weight" : 0},
                    { "calorie": 0, "protein": 0, "weight" : 0}
                ]
            };
            return data;
        },
    },
    date: {
        getCurrent: function () {
            var dt = new Date();
            return {
                "year" : dt.getFullYear(),
                "month": dt.getMonth() + 1,
                "date" : dt.getDate()
            };
        },
        getCurrentStr: function () {
            var dt = this.getCurrent();
            return dt.year + $com.format.zeroPad(dt.month) + $com.format.zeroPad(dt.date);
        }
    },
    format: {
        interpretPath: function (path) {
            var paths = path.split('/');
            if (_.isUndefined(paths[4]) === undefined) {
                paths[4] = '';
            }
            return {
                userId: paths[2],
                dateId: paths[3],
                mealId: paths[4]
            };
        },
        splitDate: function (str) {
            return {
                "year" : str.substr(1, 4),
                "month": $com.format.zeroTrim(str.substr(4, 2)),
                "date" : $com.format.zeroTrim(str.substr(6, 2))
            };
        },
        zeroTrim: function (str) {
            return str.replace(/^0/, '');
        },
        zeroPad: function (num) {
            return ('0'+num).slice(-2);
        }
    },
    auth: {
        makeHash: function () {
            var timestamp = Math.round((new Date()).getTime() / 1000);
            var ShaObj = new jsSHA(timestamp, "TEXT");
            return ShaObj.getHash("SHA-256", "HEX");
        }
    }
};


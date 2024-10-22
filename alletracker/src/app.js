var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: "/views/home.html",
        controller: "HomeController"
    })
    .when('/about', {
        templateUrl: "/views/about.html",
        controller: "AboutController"
    })
    .otherwise({
        redirectTo: '/'
    });
});

app.controller('HomeController', function($scope){
    $scope.message = 'Welcome to Home page!';
});

app.controller('AboutController', function($scope) {
    $scope.message = 'This is the About Page.';
});
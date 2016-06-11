// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngStorage', 'ngResource', 'ngCordova', 'jett.ionic.filter.bar'])

.filter('jsonDate', function ($filter) {
    return function (input, format) {
        if (!!input) {
            return $filter('date')(parseInt(input.substr(6)), format);
        }
    };
})

.run(function ($ionicPlatform, MSSinergijaFactory, $localStorage, $http, $state) {
    $localStorage.defaultUrl = 'https://www.mssinergija.net/sr/sinergija15/vesti/PublishingImages/Predavaci/';
    if ($localStorage.data == undefined) {
        $http.get('js/data.json').success(function (data) {
            $localStorage.data = data;
        });
    }

    MSSinergijaFactory.getObject().then(function (data) {
        $localStorage.data = data;
    });
    $ionicPlatform.ready(function () {
        $state.go('day');

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider) {
    $ionicFilterBarConfigProvider.placeholder('Pretraži');
    $ionicConfigProvider.views.swipeBackEnabled(true);
    $ionicConfigProvider.backButton.text('');
    $stateProvider
        .state('day', {
            url: '/day',
            templateUrl: 'templates/day.html',
            controller: 'DayListController'
        })
        .state('lectures-list', {
          url: '/lectures-list/:track',
          templateUrl: 'templates/lectures-list.html',
          controller: 'LecturesListController'
        })
        .state('single-view', {
            url: "/single-view/:lectureId/:lectureTime",
            templateUrl: 'templates/single-view.html',
            controller: 'SingleViewController'
        })
        .state('partners', {
            url: '/partners',
            templateUrl: 'templates/partners.html',
            controller: 'PartnersController'
        })
        .state('lecturers', {
            url: '/lecturers',
            templateUrl: 'templates/lecturers.html',
            controller: 'LecturersController'
        })
        .state('lecturer-single-view', {
            url: "/lecturer-single-view/:lecturerId",
            templateUrl: 'templates/lecturer-single-view.html',
            controller: 'LecturerSingleController'
        })
        .state('about-us', {
            url: '/about-us',
            templateUrl: 'templates/about-us.html',
            controller: 'AboutUsController'
        })
        .state('social-corner', {
            url: '/social-corner',
            templateUrl: 'templates/social-corner.html',
            controller: 'SocialCornerController'
        })
        .state('favorites', {
            url: '/favorites',
            templateUrl: 'templates/favorites.html',
            controller: 'FavoritesController'
        })
    $urlRouterProvider.otherwise('/day');
});

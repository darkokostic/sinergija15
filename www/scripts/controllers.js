angular.module('starter')

.controller("MainPageController", function ($rootScope, $scope, $ionicPlatform, $location, $ionicHistory, $localStorage, $ionicFilterBar, $state) {
    $scope.myGoBack = function() {
        if($ionicHistory.viewHistory().backView.stateName == 'lecturers') {
            $rootScope.onLecturers = true;
            $ionicHistory.goBack();
        } else {
            $rootScope.onLecturers = false;
            $ionicHistory.goBack();
        }
        if($ionicHistory.viewHistory().backView.stateName == 'day') {
            $rootScope.onDay = true;
            $ionicHistory.goBack();
        } else {
            $rootScope.onDay = false;
            $ionicHistory.goBack();
        }
    };
})

.controller("SideBarController", function ($rootScope, $scope, $ionicPlatform, $ionicSideMenuDelegate, $location) {
    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    }
    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    }

    $scope.toggleSearch = function () {
        $location.path('/lecturers');
        $rootScope.onLecturers = true;
    }
})
.controller("LecturesListController", function($scope, $rootScope, $stateParams, MSSinergijaFactory, $ionicSideMenuDelegate, $localStorage) {
  $rootScope.onDay = false;
  $ionicSideMenuDelegate.toggleRight();
  if($stateParams.track == 'allLectures') {
    $rootScope.isAllLectures = true;
    $scope.trackColors = 'trackAll'
    $scope.trackName = 'Sva predavanja';
    $scope.lectures = [];
    $scope.lectures = MSSinergijaFactory.getLectures();
    $scope.lectures.forEach(function (each) {
        each.lectureTime = MSSinergijaFactory.getLectureTime(each);
        each.speakerOfSession = angular.copy(MSSinergijaFactory.getSpeakerOfSession(each.Id));
        if (each.speakerOfSession.PictureUrl == null)
            if(ionic.Platform.isAndroid()){
               each.speakerOfSession.PictureUrl = "/android_asset/www/img/no-image.png";
            } else {
                each.speakerOfSession.PictureUrl = 'img/no-image.png';
            }
        else if (each.speakerOfSession.PictureUrl.indexOf('http') == -1)
            each.speakerOfSession.PictureUrl = $localStorage.defaultUrl + each.speakerOfSession.PictureUrl;
    })
  } else {
    $rootScope.isAllLectures = false;
    $scope.trackImageName = $stateParams.track;
    if($stateParams.track == 'OFC') {
      $scope.trackName = '';
    } else {
      $scope.trackName = $stateParams.track;
    }
    $scope.lectures = [];
    $scope.lectures = MSSinergijaFactory.getLecturesByTrack($stateParams.track);
    $scope.lectures.forEach(function (each) {
        each.lectureTime = MSSinergijaFactory.getLectureTime(each);
        each.speakerOfSession = angular.copy(MSSinergijaFactory.getSpeakerOfSession(each.Id));
        if (each.speakerOfSession.PictureUrl == null)
            if(ionic.Platform.isAndroid()){
               each.speakerOfSession.PictureUrl = "/android_asset/www/img/no-image.png";
            } else {
                each.speakerOfSession.PictureUrl = 'img/no-image.png';
            }
        else if (each.speakerOfSession.PictureUrl.indexOf('http') == -1)
            each.speakerOfSession.PictureUrl = $localStorage.defaultUrl + each.speakerOfSession.PictureUrl;
    })

    switch ($stateParams.track) {
      case 'DBI': $scope.trackColors = 'trackDBI';
        break;
      case 'DEV': $scope.trackColors = 'trackDEV';
        break;
      case 'DIM': $scope.trackColors = 'trackDIM';
        break;
      case 'OFC': $scope.trackColors = 'trackOFC';
        break;
      case 'WPD': $scope.trackColors = 'trackWPD';
        break;
      case 'DYN': $scope.trackColors = 'trackDYN';
        break;

      default:

    }
  }
})

.controller("DayListController", function ($ionicHistory, $rootScope, $scope, MSSinergijaFactory, $ionicSideMenuDelegate, $stateParams, $localStorage, $ionicScrollDelegate, $window) {
    $rootScope.onLecturersList = false;
    $rootScope.onDay = true;
    $scope.listCanSwipe = true;
    $scope.selectedDay = 1;
    $scope.checkDay = function (day) {
        if (day == 1) {
            $scope.firstTab = 'tabActive active';
            $scope.secondTab = 'tabDeactive';
        } else {
            $scope.firstTab = 'tabDeactive';
            $scope.secondTab = 'tabActive active';
        }
    }
    $scope.$watch('selectedDay', function (sd) {
        if (sd) {
            $scope.checkDay(sd);
            $scope.getItems(sd);
            $ionicScrollDelegate.scrollTop();
        }
    })
    $scope.getItems = function (day) {
            $scope.lectures = [];
            $scope.lectures = MSSinergijaFactory.getLectureByDay(day);
            $scope.lectures.forEach(function (each) {
                each.lectureTime = MSSinergijaFactory.getLectureTime(each);
                each.speakerOfSession = angular.copy(MSSinergijaFactory.getSpeakerOfSession(each.Id));
                //Favorite Icon color
                if ($localStorage.myFavs === undefined) {
                        $localStorage.myFavs = [];
                    }
                    var alreadyAdded = false;
                    if ($localStorage.myFavs.length !== 0) {
                        for (var i = 0; i < $localStorage.myFavs.length; i++) {
                            if (each.Id == $localStorage.myFavs[i].Id) {
                                alreadyAdded = true;
                            }
                        }
                    }
                    if(alreadyAdded == true) {
                        each.alreadyAdded = 'button-dark';
                    } else {
                        each.alreadyAdded = 'button-dark';
                    }

                if (each.speakerOfSession.PictureUrl == null)
                    if(ionic.Platform.isAndroid()){
                       each.speakerOfSession.PictureUrl = "/android_asset/www/img/no-image.png";
                    } else {
                        each.speakerOfSession.PictureUrl = 'img/no-image.png';
                    }
                else if (each.speakerOfSession.PictureUrl.indexOf('http') == -1)
                    each.speakerOfSession.PictureUrl = $localStorage.defaultUrl + each.speakerOfSession.PictureUrl;
            })
        }

      $scope.addRemoveFavorite = function (id) {
        var lectureById = MSSinergijaFactory.getLectureById(id);
          if ($localStorage.myFavs === undefined) {
              $localStorage.myFavs = [];
          }
          var alreadyAdded = false;
          if ($localStorage.myFavs.length == 0) {
              $localStorage.myFavs.push(lectureById);
          } else {
              for (var i = 0; i < $localStorage.myFavs.length; i++) {
                  if (lectureById.Id == $localStorage.myFavs[i].Id) {
                      alreadyAdded = true;
                  }
              }
              if (alreadyAdded != true) {
                  console.log("dodavanje");
                  $localStorage.myFavs.push(lectureById);
                  $scope.isFavoriteText = 'Ukloni iz omiljenog';
                  window.plugins.toast.showShortCenter('Dodato u omiljene!', function (a) {
                  }, function (b) {
                  });

                  return;
              } else {
                  for (var i = 0; i < $localStorage.myFavs.length; i++) {
                      if (lectureById.Id == $localStorage.myFavs[i].Id) {
                          $localStorage.myFavs.splice(i, 1);
                          $scope.isFavoriteText = 'Dodaj u omiljeno';
                          window.plugins.toast.showShortCenter('Obrisano iz omiljenog!', function (a) {
                          }, function (b) {
                          });
                      }
                  }
              }
          }
      }
})

.controller("SingleViewController", function ($rootScope, $scope, MSSinergijaFactory, $stateParams, $localStorage, $rootScope, $ionicHistory) {
    $rootScope.onFavorites = false;
    $rootScope.onDay = false;
    $scope.lectureTime = $stateParams.lectureTime;
    var id = $stateParams.lectureId;
    var lectureById = MSSinergijaFactory.getLectureById(id);
    $scope.lecture = lectureById;

    // Add Remove Favorites
    $scope.addRemoveFavorite = function () {
        $rootScope.isFavorite = !$rootScope.isFavorite;
        if ($localStorage.myFavs === undefined) {
            $localStorage.myFavs = [];
        }
        var alreadyAdded = false;
        if ($localStorage.myFavs.length == 0) {
            $localStorage.myFavs.push(lectureById);
        } else {
            for (var i = 0; i < $localStorage.myFavs.length; i++) {
                if (lectureById.Id == $localStorage.myFavs[i].Id) {
                    alreadyAdded = true;
                }
            }
            if (alreadyAdded != true) {
                console.log("dodavanje");
                $localStorage.myFavs.push(lectureById);
                $scope.isFavoriteText = 'Ukloni iz omiljenog';
                window.plugins.toast.showShortCenter('Dodato u omiljene!', function (a) {
                    //console.log('toast success: ' + a)
                }, function (b) {
                    //alert('toast error: ' + b)
                })
                return;
            } else {
                for (var i = 0; i < $localStorage.myFavs.length; i++) {
                    if (lectureById.Id == $localStorage.myFavs[i].Id) {
                        console.log("brisanje");
                        $localStorage.myFavs.splice(i, 1);
                        $scope.isFavoriteText = 'Dodaj u omiljeno';
                        window.plugins.toast.showShortCenter('Obrisano iz omiljenog!', function (a) {
                            //console.log('toast success: ' + a)
                        }, function (b) {
                            //alert('toast error: ' + b)
                        })
                    }
                }
            }
        }
    }

    //Favorite Icon color
    if ($localStorage.myFavs === undefined) {
            $localStorage.myFavs = [];
        }
        var alreadyAdded = false;
        if ($localStorage.myFavs.length !== 0) {
            for (var i = 0; i < $localStorage.myFavs.length; i++) {
                if (lectureById.Id == $localStorage.myFavs[i].Id) {
                    alreadyAdded = true;
                }
            }
        }
        if(alreadyAdded == true) {
            $rootScope.isFavorite = true;
            $scope.isFavoriteText = 'Ukloni iz omiljenog';
        } else {
            $rootScope.isFavorite = false;
            $scope.isFavoriteText = 'Dodaj u omiljeno';
        }

    $scope.lectureDate = MSSinergijaFactory.getDateOfSession(lectureById);
    $scope.room = MSSinergijaFactory.getRoomBySession(lectureById);
    $scope.speaker = MSSinergijaFactory.getSpeakerOfSession(id);
    if ($scope.speaker.PictureUrl == null) {
        $scope.speakerPicture = 'img/no-image.png';
    } else {
        $scope.speakerPicture = $localStorage.defaultUrl + $scope.speaker.PictureUrl;
    }
})

.controller("LecturersController", function ($rootScope, $scope, $ionicSideMenuDelegate, MSSinergijaFactory, $localStorage, $ionicFilterBar) {
    $rootScope.onLecturers = true;
    $rootScope.onDay = false;
    $ionicSideMenuDelegate.toggleLeft();
    $scope.speakers = $localStorage.data.Speakers;
    angular.forEach($scope.speakers, function (obj) {
        if (obj.PictureUrl == null) {
            obj["pictureUrl"] = 'img/no-image.png';
        } else {
            obj["pictureUrl"] = $localStorage.defaultUrl + obj.PictureUrl;
        }
    })

    //CODE FOR SEARCH lecturers
    var filterBarInstance;

    function getItems () {
      var items = $scope.speakers;
      $scope.items = items;
    }

    getItems();

    $rootScope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.items,
        update: function (filteredItems, filterText) {
          $scope.items = filteredItems;
          if (filterText) {
          }
        },
          filterProperties: ['FirstName']
      });
    };
})

.controller("LecturerSingleController", function ($scope, $ionicSideMenuDelegate, MSSinergijaFactory, $stateParams, $ionicHistory, $localStorage) {
    $scope.myGoBack = function () {
        $ionicHistory.goBack();
    };
    var id = $stateParams.lecturerId;
    $scope.track = MSSinergijaFactory.getSessionOfSpeaker(id).Track;

    $scope.speaker = angular.copy(MSSinergijaFactory.getLecturer(id));
    if ($scope.speaker.PictureUrl == null) {
        $scope.speaker.PictureUrl = 'img/no-image.png';
    } else {
        $scope.speaker.PictureUrl = $localStorage.defaultUrl + $scope.speaker.PictureUrl;
    }
    $scope.lectures = [angular.copy(MSSinergijaFactory.getSessionOfSpeaker(id))];
    $scope.lectures.forEach(function (each) {
       each.lectureTime = MSSinergijaFactory.getLectureTime(each);
    })
})

.controller("PartnersController", function ($rootScope, $scope, $ionicSideMenuDelegate, MSSinergijaFactory, $http) {
    $rootScope.onDay = false;
    $ionicSideMenuDelegate.toggleLeft();
    var url = 'js/partners.json';
    $http.get(url, {
       headers: {}
       })
    .then(function(response) {
        var partneri = [];
        var prijatelji = [];
        var mpartneri = [];
        var tpartneri = [];
        for(var i = 0; i < response.data.results.length; i++) {
          if(response.data.results[i].vrsta == 'generalni sponzor') {
            $scope.comtrade = response.data.results[i].partnerLogo.url;
          }
          if(response.data.results[i].vrsta == 'zlatni sponzor') {
            $scope.dell = response.data.results[i].partnerLogo.url;
          }
          if(response.data.results[i].vrsta == 'partneri') {
            partneri.push(response.data.results[i]);
          }
          if(response.data.results[i].vrsta == 'sponzor') {
            $scope.softnet = response.data.results[i].partnerLogo.url;
          }
          if(response.data.results[i].vrsta == 'tehnicki partneri') {
            tpartneri.push(response.data.results[i]);
          }
          if(response.data.results[i].vrsta == 'sponzor zvanicne sinergija 15 mobilne aplikacije') {
            $scope.new = response.data.results[i].partnerLogo.url;
          }
          if(response.data.results[i].vrsta == 'prijatelji konferencije') {
            prijatelji.push(response.data.results[i]);
          }
          if(response.data.results[i].vrsta == 'medijski partneri') {
            mpartneri.push(response.data.results[i]);
          }
        }
        $scope.partneri = partneri;
        $scope.tpartneri = tpartneri;
        $scope.mpartneri = mpartneri;
        $scope.prijatelji = prijatelji;
    });
})

.controller("SocialCornerController", function ($rootScope, $scope, $ionicSideMenuDelegate, $resource, MSSinergijaFactory, $timeout) {
    $rootScope.onDay = false;
    $ionicSideMenuDelegate.toggleLeft();
    MSSinergijaFactory.getTweets();

    $scope.doRefresh = function() {
        $timeout( function() {
        //simulate async response
        MSSinergijaFactory.getTweets();
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');

      }, 1000);

    };
})

.controller("AboutUsController", function ($scope, $ionicSideMenuDelegate, $rootScope) {
    $rootScope.onDay = false;
    $ionicSideMenuDelegate.toggleLeft();
    google.maps.event.addDomListener(window, 'load', initialize());

    function initialize() {
        var myLatLng = new google.maps.LatLng(44.807341, 20.435142);
        var mapOptions = {
            center: myLatLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: false,
            streetViewControl: false,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            }
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Crowne Plaza'
        });
        $scope.map = map;
    }
})

.controller("FavoritesController", function ($rootScope, $scope, MSSinergijaFactory, $ionicSideMenuDelegate, $localStorage) {
    $rootScope.hasFavorites = 'noFavorites';
    $rootScope.onDay = false;
    $scope.onFavorite = true;
    if ($ionicSideMenuDelegate.isOpen()) {
        $ionicSideMenuDelegate.toggleLeft();
    }

    if ($localStorage.myFavs === undefined) {
        $localStorage.myFavs = [];
    }
    if ($localStorage.myFavs.length > 0) {
        $scope.lectures = $localStorage.myFavs;
        var i = 0;
        angular.forEach($scope.lectures, function (obj) {
            obj["time"] = MSSinergijaFactory.getLectureTime($localStorage.myFavs[i]);
            if (MSSinergijaFactory.getSpeakerOfSession($localStorage.myFavs[i].Id).PictureUrl == null) {
                obj["pictureUrl"] = 'img/no-image.png';
            } else {
                obj["pictureUrl"] = $localStorage.defaultUrl + MSSinergijaFactory.getSpeakerOfSession($localStorage.myFavs[i].Id).PictureUrl;
            }
            i++;
        });
        $rootScope.hasFavorites = 'haveFavorites';
    }
});

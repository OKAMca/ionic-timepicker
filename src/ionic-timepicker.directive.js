//By Rajeshwar Patlolla
//https://github.com/rajeshwarpatlolla

(function () {
  'use strict';

  angular.module('ionic-timepicker')
    .directive('ionicTimepicker', ionicTimepicker);

  ionicTimepicker.$inject = ['$ionicPopup'];
  function ionicTimepicker($ionicPopup) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        inputObj: "=inputObj"
      },
      link: function (scope, element, attrs) {

        //console.log(scope.inputObj);

        var today = new Date();
        var currentEpoch = today.getHours();

        scope.inputEpochTime = scope.inputObj.inputEpochTime ? scope.inputObj.inputEpochTime : (currentEpoch * 60 * 60);
        scope.step = scope.inputObj.step ? scope.inputObj.step : 15;
        scope.format = scope.inputObj.format ? scope.inputObj.format : 24;
        scope.titleLabel = scope.inputObj.titleLabel ? scope.inputObj.titleLabel : 'Time Picker';
        scope.setLabel = scope.inputObj.setLabel ? scope.inputObj.setLabel : 'Set';
        scope.closeLabel = scope.inputObj.closeLabel ? scope.inputObj.closeLabel : 'Close';
        scope.setButtonType = scope.inputObj.setButtonType ? scope.inputObj.setButtonType : 'button-positive';
        scope.closeButtonType = scope.inputObj.closeButtonType ? scope.inputObj.closeButtonType : 'button-stable';

        var obj = {epochTime: scope.inputEpochTime, step: scope.step, format: scope.format};

        scope.time = {hours: 0, minutes: 0, seconds: 0, meridian: ""};

        var objDate = new Date(obj.epochTime * 1000);       // Epoch time in milliseconds.

        var totalMinutes;

          if (obj.format == 20) {
            totalMinutes = 20;
          } else {
            totalMinutes = 60;
          }

        scope.increaseHours = function () {
          scope.time.hours = Number(scope.time.hours);
          if (obj.format == 12) {
            if (scope.time.hours != 12) {
              scope.time.hours += 1;
            } else {
              scope.time.hours = 1;
            }
          }
          if (obj.format == 24) {
            if (scope.time.hours != 23) {
              scope.time.hours += 1;
            } else {
              scope.time.hours = 0;
            }
          }
          scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
        };

        scope.decreaseHours = function () {
          scope.time.hours = Number(scope.time.hours);
          if (obj.format == 12) {
            if (scope.time.hours > 1) {
              scope.time.hours -= 1;
            } else {
              scope.time.hours = 12;
            }
          }
          if (obj.format == 24) {
            if (scope.time.hours > 0) {
              scope.time.hours -= 1;
            } else {
              scope.time.hours = 23;
            }
          }
          scope.time.hours = (scope.time.hours < 10) ? ('0' + scope.time.hours) : scope.time.hours;
        };

        scope.increaseMinutes = function () {
          scope.time.minutes = Number(scope.time.minutes);
          if (scope.time.minutes != (totalMinutes - obj.step) && (scope.time.minutes + obj.step <= totalMinutes)) {
            scope.time.minutes += obj.step;
          } else {
            scope.time.minutes = 0;
          }
          scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
        };

        scope.decreaseMinutes = function () {
          scope.time.minutes = Number(scope.time.minutes);
          if (scope.time.minutes != 0 && (scope.time.minutes - obj.step > 0)) {
            scope.time.minutes -= obj.step;
          } else {
            scope.time.minutes = totalMinutes - obj.step;
          }
          scope.time.minutes = (scope.time.minutes < 10) ? ('0' + scope.time.minutes) : scope.time.minutes;
        };

        scope.increaseSeconds = function() {
          scope.time.seconds = Number(scope.time.seconds);

          if (scope.time.seconds != (60 - obj.step) && (scope.time.seconds + obj.step <= 60)) {
            scope.time.seconds += obj.step;
          } else {
            scope.time.seconds = 0;
          }
          scope.time.seconds = (scope.time.seconds < 10) ? ('0' + scope.time.seconds) : scope.time.seconds;
        };

        scope.decreaseSeconds = function() {
          scope.time.seconds = Number(scope.time.seconds);
          if (scope.time.seconds != 0 && (scope.time.seconds - obj.step > 0)) {
            scope.time.seconds -= obj.step;
          } else {
            scope.time.seconds = 60 - obj.step;
          }
          scope.time.seconds = (scope.time.seconds < 10) ? ('0' + scope.time.seconds) : scope.time.seconds;
        };

        scope.changeMeridian = function () {
          scope.time.meridian = (scope.time.meridian === "AM") ? "PM" : "AM";
        };

        scope.prependZero = function(param) {
          if (String(param).length < 2) {
            return "0" + String(param);
          }
          return param;
        };

        scope.timeParser = function(val, opType) {
          var minutes, seconds;

          if (opType === "minutes") {
            minutes = parseInt(val / 3600);
            return scope.prependZero(minutes);
          } else if (opType === "seconds") {
            seconds = (val / 60) % 60;
            return scope.prependZero(seconds);
          }
        };

        scope.getSeconds = function() {
          var totalSec = 0;

          if (scope.time.minutes != 20) {
            totalSec = (scope.time.minutes * 60 * 60) + (scope.time.seconds * 60);
          } else {
            totalSec = scope.time.seconds * 60;
          }

          return totalSec;
        };

        element.on("click", function () {
          if (scope.inputObj.inputEpochTime) {
            objDate = new Date(scope.inputObj.inputEpochTime * 1000);
          }

          if (obj.format == 12) {

            scope.time.meridian = (objDate.getUTCHours() >= 12) ? "PM" : "AM";
            scope.time.hours = (objDate.getUTCHours() > 12) ? ((objDate.getUTCHours() - 12)) : (objDate.getUTCHours());
            scope.time.minutes = (objDate.getUTCMinutes());

            scope.time.hours = (scope.time.hours < 10) ? ("0" + scope.time.hours) : (scope.time.hours);
            scope.time.minutes = (scope.time.minutes < 10) ? ("0" + scope.time.minutes) : (scope.time.minutes);

            if (scope.time.hours == 0 && scope.time.meridian == "AM") {
              scope.time.hours = 12;
            }

            $ionicPopup.show({
              templateUrl: 'ionic-timepicker-12-hour.html',
              title: scope.titleLabel,
              subTitle: '',
              scope: scope,
              buttons: [
                {
                  text: scope.closeLabel,
                  type: scope.closeButtonType,
                  onTap: function (e) {
                    scope.inputObj.callback(undefined);
                  }
                },
                {
                  text: scope.setLabel,
                  type: scope.setButtonType,
                  onTap: function (e) {
                    scope.loadingContent = true;

                    var totalSec = 0;

                    if (scope.time.hours != 12) {
                      totalSec = (scope.time.hours * 60 * 60) + (scope.time.minutes * 60);
                    } else {
                      totalSec = scope.time.minutes * 60;
                    }

                    if (scope.time.meridian === "AM") {
                      totalSec += 0;
                    } else if (scope.time.meridian === "PM") {
                      totalSec += 43200;
                    }
                    scope.etime = totalSec;
                    scope.inputObj.callback(scope.etime);
                  }
                }
              ]
            })

          } else if (obj.format == 24) {

            scope.time.hours = (objDate.getUTCHours());
            scope.time.minutes = (objDate.getUTCMinutes());

            scope.time.hours = (scope.time.hours < 10) ? ("0" + scope.time.hours) : (scope.time.hours);
            scope.time.minutes = (scope.time.minutes < 10) ? ("0" + scope.time.minutes) : (scope.time.minutes);

            $ionicPopup.show({
              templateUrl: 'ionic-timepicker-24-hour.html',
              title: scope.titleLabel,
              subTitle: '',
              scope: scope,
              buttons: [
                {
                  text: scope.closeLabel,
                  type: scope.closeButtonType,
                  onTap: function (e) {
                    scope.inputObj.callback(undefined);
                  }
                },
                {
                  text: scope.setLabel,
                  type: scope.setButtonType,
                  onTap: function (e) {

                    scope.loadingContent = true;

                    var totalSec = 0;

                    if (scope.time.hours != 24) {
                      totalSec = (scope.time.hours * 60 * 60) + (scope.time.minutes * 60);
                    } else {
                      totalSec = scope.time.minutes * 60;
                    }
                    scope.etime = totalSec;
                    scope.inputObj.callback(scope.etime);
                  }
                }
              ]
            })
          } else if (obj.format == 20) {

            scope.time.minutes = scope.timeParser(scope.getSeconds(), "minutes");
            scope.time.seconds = scope.timeParser(scope.getSeconds(), "seconds");

            $ionicPopup.show({
              templateUrl: 'ionic-timepicker-20-minute.html',
              title: scope.titleLabel,
              subTitle: '',
              scope: scope,
              buttons: [
                {
                  text: scope.closeLabel,
                  type: scope.closeButtonType,
                  onTap: function (e) {
                    scope.inputObj.callback(undefined);
                  }
                },
                {
                  text: scope.setLabel,
                  type: scope.setButtonType,
                  onTap: function (e) {
                    scope.loadingContent = true;
                    scope.etime = scope.getSeconds();
                    scope.inputObj.callback(scope.etime);
                  }
                }
              ]
            })
          }
        });
      }
    };
  }

})();
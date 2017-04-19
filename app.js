var app;
(function(){
  app = angular.module('Encoder', ['ngMaterial', 'nvd3'])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('blue-grey');
    $mdThemingProvider.theme('success-toast');
    $mdThemingProvider.theme('error-toast');
    
    $mdThemingProvider.alwaysWatchTheme(true);
  })  
})();

app.controller('mainController', function($scope, $mdToast){

    $scope.rollerencoder = rollerencoder;

    // Disabling the mouse right click event
    document.addEventListener('contextmenu', function(event) { event.preventDefault();});

    // ---------- Graph Code START -----------
    $scope.options = {
        chart: {
            type: 'lineChart',
            height: 250,
            width: 380,
            margin : {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            duration: 0,    
            yAxis: {
                tickFormat: function(d){
                   return d3.format('.01f')(d);
                }
            },
            xAxis: {
                axisLabel:'Time',
                tickFormat: function(d){
                    for(var uuid in $scope.rollerencoder.peripherals){
                        if($scope.rollerencoder.peripherals[uuid].counterGraphData[0].values[d]){
                            var label = $scope.rollerencoder.peripherals[uuid].counterGraphData[0].values[d].label;
                            return label;
                        }
                    }
                }
            }
        }
    };

    $scope.counterOptions = angular.copy($scope.options);

    $scope.counterData = [{ values: [], key: 'Rotations' }];
    
    var x = 0;
    setInterval(function(){
        for(var uuid in $scope.rollerencoder.peripherals){
            if(!isNaN($scope.rollerencoder.peripherals[uuid].counterData.timeNum) && !isNaN($scope.rollerencoder.peripherals[uuid].counterData.temp)){
                $scope.rollerencoder.peripherals[uuid].counterGraphData[0].values.push(
                    { x: $scope.rollerencoder.peripherals[uuid].counterData.timeNum,
                      y: $scope.rollerencoder.peripherals[uuid].counterData.temp,
                      label:$scope.rollerencoder.peripherals[uuid].counterData.date});
            }
            if ($scope.rollerencoder.peripherals[uuid].counterGraphData[0].values.length > 100) $scope.rollerencoder.peripherals[uuid].counterGraphData[0].values.shift();
            }
        x++;
    }, 1000);
    // ---------- Graph Code END -----------

    $scope.rollerencoder.onSuccess = function(message){
        $mdToast.show(
          $mdToast.simple()
            .content(message)
            .position('top right')
            .hideDelay(4000)
            .theme("success-toast")
        );
    };

    $scope.rollerencoder.onError = function(message){
        $mdToast.show(
          $mdToast.simple()
            .content(message)
            .position('top right')
            .hideDelay(2500)
            .theme("error-toast")
        );
    };

    $scope.rollerencoder.updateUI = function(){
      $scope.$apply();
    };

    $scope.rollerencoder.onSuccess('Scanning ....');
});
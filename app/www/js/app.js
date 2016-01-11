// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordovaBeacon'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

.controller("ExampleController", function($scope, $rootScope, $ionicPlatform, $cordovaBeacon) {
    // Always hide the card(unless in beacon range)
    $scope.showCard = false;
    $scope.showBG = true;

    // Add device ready event listener
    document.addEventListener("deviceready", onDeviceReady, false);

    // Callback to determing state for the region
    function didDetermineStateForRegion(pluginResult) {
        //console.log(JSON.stringify(pluginResult));
    }

    // Callback to start monitoring a region
    function didStartMonitoringForRegion (pluginResult) {
        //console.log(JSON.stringify(pluginResult));
    }

    // Callback called when exiting a region
    function didExitRegion(pluginResult) {
        /*$cordovaLocalNotification.add({
        id: 30244234234,
        title: "Good By!",
        text: "Hope to see you again."
            }).then(function () {
            });*/
    }

    // Callback called when entering a region
    function didEnterRegion (pluginResult) {
        /*$cordovaLocalNotification.add({
        title: "Welcome"
        text: "Tap to launch app"
            }).then(function () {

            });*/
    }

    // Callback called if Ranging is enabled
    function didRangeBeaconsInRegion (pluginResult) {
        // Capture the closest beacon regardless of the length
        var closestBeacon = pluginResult.beacons[0];

        if(closestBeacon){
            if(closestBeacon["accuracy"] <= 1.4){
                // Set ng-show to true to show the card as we are in range
                $scope.showCard = true;
                $scope.showBG = false;

                // This is required for binding the data to the HTML element
                // Also to notify that there has been a change in the data.
                $scope.$apply();

                if(closestBeacon["uuid"] == "31b32e3c-5e8b-68f8-0493-ff9dcaa7c4b7"){
                    console.log("Show Mint: " + closestBeacon["accuracy"]);

                    document.getElementById("cardheader").innerHTML = "Welcome to Aikyatha!";
                    document.getElementById("cardimage").src = "img/Kanji1.jpg"
                    document.getElementById("cardfooter").innerHTML = "Explore Kanjivarams and more...";
                }

                if(closestBeacon["uuid"] == '29644b63-3ebd-ae99-ed00-0608f6a708a4'){
                    console.log("Show Ice: " + closestBeacon["accuracy"]);
                    document.getElementById("cardheader").innerHTML = "Exclusive Design";
                    document.getElementById("cardimage").src = "img/Kanji2.jpg";
                    document.getElementById("cardfooter").innerHTML = "Great Styles & Colors!";
                }

                if(closestBeacon["uuid"] == '70e09360-015d-dc97-ccd3-f1593b8a4297'){
                    console.log("Show Blueberry: " + closestBeacon["accuracy"]);
                    document.getElementById("cardheader").innerHTML = "Limited time offer";
                    document.getElementById("cardimage").src = "img/sample.png";
                    document.getElementById("cardfooter").innerHTML = "Show code for 20% off!";
                }
            }
        }
    }

    // Wait for the device to get ready
    function onDeviceReady() {
        var delegate = new cordova.plugins.locationManager.Delegate();

        delegate.didDetermineStateForRegion = didDetermineStateForRegion;
        delegate.didStartMonitoringForRegion = didStartMonitoringForRegion;
        delegate.didRangeBeaconsInRegion = didRangeBeaconsInRegion;
        delegate.didEnterRegion = didEnterRegion;
        delegate.didExitRegion = didExitRegion;

        cordova.plugins.locationManager.setDelegate(delegate);

        // Required only for iOS 8+
        cordova.plugins.locationManager.requestAlwaysAuthorization();

        // Create the beacon regions(with ranging and monitoring)
        createBeacons();

        // Function to create multiple beacons(customize this for own use)
        // Start both Ranging and Monitoring
        function createBeacons(){
            var mintBeaconRegion = createBeacon('mintEstimote', '31B32E3C-5E8B-68F8-0493-FF9DCAA7C4B7', 10002, 48896);
            var iceBeaconRegion = createBeacon('iceEstimote', '29644B63-3EBD-AE99-ED00-0608F6A708A4', 28374, 41843);
            var blueberryBeaconRegion = createBeacon('blueberryEstimote', '70E09360-015D-DC97-CCD3-F1593B8A4297', 56444, 40894);

            // Start monitoring all the beacons
            // NOTE: Advantages: 1. Works in the foreground, background, and even when the app is killed.
            //                   2. Can detect entering and exiting a region
            //    Disadvantages: 1. Not as responsive as ranging(as it uses low power scanning)
            //                   2. If Wi-Fi/Bluetooth is in use or used recently, the response
            //                      is instantaneous but slow otherwise
            /*cordova.plugins.locationManager.startMonitoringForRegion(mintBeaconRegion)
                .fail(console.error)
                .done();

            cordova.plugins.locationManager.startMonitoringForRegion(iceBeaconRegion)
                .fail(console.error)
                .done();

            cordova.plugins.locationManager.startMonitoringForRegion(blueberryBeaconRegion)
                .fail(console.error)
                .done();*/

            // Start ranging all the beacons(not used for now, see Disadvantages)
            // NOTE: Advantages: More responsive compared to monitoring
            //    Disadvantages: 1. Not advisable to run in background(Apple will likely reject it)
            //                   2. When running in the background can drain the battery
            cordova.plugins.locationManager.startRangingBeaconsInRegion(mintBeaconRegion)
                .fail(console.error)
                .done();

            cordova.plugins.locationManager.startRangingBeaconsInRegion(iceBeaconRegion)
                .fail(console.error)
                .done();

            cordova.plugins.locationManager.startRangingBeaconsInRegion(blueberryBeaconRegion)
                .fail(console.error)
                .done();
        }

        // Function to create a beacon region
        function createBeacon(identifier, uuid, major, minor) {
            // throws an error if the parameters are not valid
            var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
            return beaconRegion;
        }

    }
});

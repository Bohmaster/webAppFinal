var app = angular.module('az-web-app');

app.directive("contenteditable", function () {
    return {
        restrict: "A",
        require : "ngModel",
        link    : function (scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function () {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function () {
                scope.$apply(read);
            });
        }
    };
});

app.directive('mapa', function ($interpolate) {
    return {
        restrict: 'E',
        template: '<div id="map" class="divMapa" style="width: 100%; height: 450px;"></div>',
        link    : function (scope, elem, attrs) {

            var geocoder;
            var map;

            attrs.$observe('dir', function (value) {

                console.log('dir', value, JSON.parse(attrs.dir));

                var _dirs = JSON.parse(attrs.dir);

                var mapOptions = {
                    zoom     : 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map            = new google.maps.Map(document.getElementById("map"), mapOptions);
                map.setCenter(new google.maps.LatLng(-32.9221398, -60.6683691, 12), 20);

                geocoder = new google.maps.Geocoder();

                for (i = 0; i < _dirs.length; i++) {
                    console.log(_dirs, i);
                    geocoder.geocode({'address': _dirs[i].address + ", Rosario, Argentina"}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var marker = new google.maps.Marker({
                                map      : map,
                                position : results[0].geometry.location,
                                icon     : 'images/marker.png',
                                animation: google.maps.Animation.DROP
                            });

                            marker.addListener('click', function () {
                                contentString =
                                    '<div class="mapContentWrapper">' +
                                    '<div class="entityHeader">' + 'AZ CLUB ENTITY' + '</div>' +
                                    '<div class="entityBody"></div>' +
                                    '</div>';
                                infowindow    = new google.maps.InfoWindow({
                                    content: contentString
                                });

                                infowindow.open(map, marker);
                            });
                        } else {
                            //console.log(status);
                        }
                    });
                }
            });

        }
    }
});

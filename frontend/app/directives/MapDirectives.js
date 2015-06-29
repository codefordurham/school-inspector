angular.module('SchoolsApp.directives', [])
    .directive('schoolsMap', ['$q', 'Schools', '$location', '$rootScope', function($q, Schools, $location, $rootScope) {
        var linker = function(scope, element, attrs) {
            // do all map rendering and interactions here
            element.height($(window).height()).width($(window).width());
            var map,
                marker,
                markerLatLng,
                schools_layers = [],
                map_highlights = L.featureGroup(),
                homeIcon = L.divIcon({className: 'fa fa-home fa-3x', iconSize: [32, 32], iconAnchor: [16, 16]});
            // default zoom controls position
            if ($location.$$path === '/') {
              map = new L.map('map', { zoomControl:true }).setView([35.99, -78.9], 13);
            } else {
              map = new L.map('map', { zoomControl:true });
            }
            map.zoomControl.setPosition("bottomright");
            map.on("mouseover", function() {
                scope.clear_highlight();
            });
            map_highlights.addTo(map);

            d = $q.defer();
            d.resolve(map);
            d.promise.then(function() {
                L.tileLayer('https://{s}.tiles.mapbox.com/v3/vrocha.j3fib8g6/{z}/{x}/{y}.png', {
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                    maxZoom: 18
                }).addTo(map);
            });

            // resize map to fit current window
            $(window).bind('resize', function() {
                element.css({
                    "height": document.documentElement.clientHeight + "px"
                });
            });
            // variable changes
            scope.$watch(attrs.userLocation, function(location) {
                // add or move marker to map
                if (location) {
                    if (marker) {
                        markerLatLng = new L.LatLng(location.latitude, location.longitude);
                        marker.setLatLng(markerLatLng);
                    } else {
                        marker = L.marker(
                            [location.latitude, location.longitude],
                            {icon: homeIcon, draggable: true, riseOnHover: true}
                        ).addTo(map);
                    }
                    marker.on('dragend', function(event){
                        var marker = event.target;
                        var position = marker.getLatLng();
                        scope.$apply(function(){
                            $location.path('/location/' + position.lat + '/' + position.lng + '/').replace();
                        });
                    });
                    // center marker
                    map.setView([location.latitude, location.longitude], 12);
                }
            });

            scope.$watch(attrs.schools, function(schools, oldvalue) {
                // clear map
                if (schools) {
                    clearMap();
                    angular.forEach(schools, function(school) {
                        var schoolIcon = L.divIcon({className: school.type + ' school_point ' + school.level + ' ' + (school.year_round ? "year-round" : ""), iconSize: [48,48], iconAnchor: [24,24], html: school.short_name});
                        var school_layer,
                            school_marker =  L.marker([school.location.coordinates['1'], school.location.coordinates['0']], {icon: schoolIcon})
                                .bindPopup(school.name, { offset: new L.Point(0, -10) });

                        school_marker.school_id = school.id;
                        school_marker.on('mouseover', function() {
                            // highlight district
                            scope.highlight_school(this.school_id);
                            // highlight list item
                            $('.school-group-item.item-' + this.school_id).addClass('active')
                        });
                        school_marker.on('mouseout', function() {
                            // remove district highlight
                            scope.clear_highlight();
                            // remove list item highlight
                            $('.school-group-item').removeClass('active')
                        });
                        school_layer = L.layerGroup([school_marker]);
                        schools_layers.push(school_layer);
                        school_layer.addTo(map);
                    });
                }
            });

            scope.highlight_school = function(school_id) {
                // remove current highlight
                scope.clear_highlight();
                Schools.get(school_id).success(function(school) {
                    var district_bounderies = [];
                    var fields = ['district', 'priority_zone', 'walk_zone', 'choice_zone', 'year_round_zone'];
                    angular.forEach(fields, function(field) {
                        if (school[field]) {
                            angular.forEach(school[field].coordinates[0], function(coordinates, key) {
                                // HACK: coordinates need to be inverted.
                                // just the django things.
                                district_bounderies.push([coordinates[1], coordinates[0]]);
                            });
                        }

                    });

                    if (district_bounderies) {
                        map_highlights.addLayer(L.polygon(district_bounderies, {color: school.color, className: school.type + ' ' + school.level}));

                    }
                });
            };

            scope.clear_highlight = function() {
                map_highlights.clearLayers();
            };

            $('.nav li a').click(function() {
                // remove current highlight
                scope.clear_highlight();
            });

            var clearMap = function() {
                angular.forEach(schools_layers, function(layer) {
                    map.removeLayer(layer);
                });
                schools_layers = [];
            };
        };

        return {
            restrict: 'A',
            link: linker
        };
    }]);

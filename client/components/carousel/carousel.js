'use strict';
angular.module('wildfoodApp.carousel', ['ui.bootstrap.transition'])
    .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {
        var self = this,
            slides = self.slides = [],
            currentIndex = -1,
            currentTimeout, isPlaying;
        self.currentSlide = null;

        var destroyed = false;
        /* direction: "prev" or "next" */
        self.select = function(nextSlide, direction) {
            var nextIndex = slides.indexOf(nextSlide);
            //Decide direction if it's not given
            if (direction === undefined) {
                direction = nextIndex > currentIndex ? "next" : "prev";
            }
            if (nextSlide && nextSlide !== self.currentSlide) {
                if ($scope.$currentTransition) {
                    $scope.$currentTransition.cancel();
                    //Timeout so ng-class in template has time to fix classes for finished slide
                    $timeout(goNext);
                } else {
                    goNext();
                }
            }
            function goNext() {
                // Scope has been destroyed, stop here.
                if (destroyed) { return; }
                //If we have a slide to transition from and we have a transition type and we're allowed, go
                if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
                    //We shouldn't do class manip in here, but it's the same weird thing bootstrap does. need to fix sometime
                    nextSlide.$element.addClass(direction);
                    var reflow = nextSlide.$element[0].offsetWidth; //force reflow

                    //Set all other slides to stop doing their stuff for the new transition
                    angular.forEach(slides, function(slide) {
                        angular.extend(slide, {direction: '', entering: false, leaving: false, active: false});
                    });
                    angular.extend(nextSlide, {direction: direction, active: true, entering: true});
                    angular.extend(self.currentSlide||{}, {direction: direction, leaving: true});

                    $scope.$currentTransition = $transition(nextSlide.$element, {});
                    //We have to create new pointers inside a closure since next & current will change
                    (function(next,current) {
                        $scope.$currentTransition.then(
                            function(){ transitionDone(next, current); },
                            function(){ transitionDone(next, current); }
                        );
                    }(nextSlide, self.currentSlide));
                } else {
                    transitionDone(nextSlide, self.currentSlide);
                }
                self.currentSlide = nextSlide;
                currentIndex = nextIndex;
                //every time you change slides, reset the timer
                restartTimer();

                if($scope.onSlideChange){
                    $scope.onSlideChange({$index: currentIndex});
                }

            }

            function transitionDone(next, current) {
                angular.extend(next, {direction: '', active: true, leaving: false, entering: false});
                angular.extend(current||{}, {direction: '', active: false, leaving: false, entering: false});
                $scope.$currentTransition = null;
            }
        };
        $scope.$on('$destroy', function () {
            destroyed = true;
        });

        /* Allow outside people to call indexOf on slides array */
        self.indexOfSlide = function(slide) {
            return slides.indexOf(slide);
        };

        $scope.next = function() {
            var newIndex = (currentIndex + 1) % slides.length;

            //Prevent this user-triggered transition from occurring if there is already one in progress
            if (!$scope.$currentTransition) {
                return self.select(slides[newIndex], 'next');
            }
        };

        $scope.prev = function() {
            var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;

            //Prevent this user-triggered transition from occurring if there is already one in progress
            if (!$scope.$currentTransition) {
                return self.select(slides[newIndex], 'prev');
            }
        };

        $scope.select = function(slide) {
            self.select(slide);
        };

        $scope.isActive = function(slide) {
            return self.currentSlide === slide;
        };

        $scope.slides = function() {
            return slides;
        };

        $scope.$watch('interval', restartTimer);
        $scope.$on('$destroy', resetTimer);

        function restartTimer() {
            resetTimer();
            var interval = +$scope.interval;
            if (!isNaN(interval) && interval>=0) {
                currentTimeout = $timeout(timerFn, interval);
            }
        }

        function resetTimer() {
            if (currentTimeout) {
                $timeout.cancel(currentTimeout);
                currentTimeout = null;
            }
        }

        function timerFn() {
            if (isPlaying) {
                $scope.next();
                restartTimer();
            } else {
                $scope.pause();
            }
        }

        $scope.play = function() {
            if (!isPlaying) {
                isPlaying = true;
                restartTimer();
            }
        };
        $scope.pause = function() {
            if (!$scope.noPause) {
                isPlaying = false;
                resetTimer();
            }
        };

        self.addSlide = function(slide, element) {
            slide.$element = element;
            slides.push(slide);
            //if this is the first slide or the slide is set to active, select it
            if(slides.length === 1 || slide.active) {
                self.select(slides[slides.length-1]);
                if (slides.length == 1) {
                    $scope.play();
                }
            } else {
                slide.active = false;
            }
        };

        self.removeSlide = function(slide) {
            //get the index of the slide inside the carousel
            var index = slides.indexOf(slide);
            slides.splice(index, 1);
            if (slides.length > 0 && slide.active) {
                if (index >= slides.length) {
                    self.select(slides[index-1]);
                } else {
                    self.select(slides[index]);
                }
            } else if (currentIndex > index) {
                currentIndex--;
            }
        };

    }])
    .directive('plAdminCarousel', [function() {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            controller: 'CarouselController',
//            require: 'plAdminCarousel',
            templateUrl: 'components/carousel/carousel.tpl.html',
            scope: {
                interval: '=',
                noTransition: '=',
                noPause: '=',
                onSlideChange: '&'
            }
        };
    }]) .directive('plAdminSlide', ['$parse', function($parse) {
        return {
            require: '^plAdminCarousel',
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: 'components/carousel/slide.tpl.html',
            scope: {
            },
            link: function (scope, element, attrs, carouselCtrl) {
                //Set up optional 'active' = binding
            	console.log('plAdminSlide');
                if (attrs.active) {
                    var getActive = $parse(attrs.active);
                    var setActive = getActive.assign;
                    var lastValue = scope.active = getActive(scope.$parent);
                    scope.$watch(function parentActiveWatch() {
                        var parentActive = getActive(scope.$parent);

                        if (parentActive !== scope.active) {
                            // we are out of sync and need to copy
                            if (parentActive !== lastValue) {
                                // parent changed and it has precedence
                                lastValue = scope.active = parentActive;
                            } else {
                                // if the parent can be assigned then do so
                                setActive(scope.$parent, parentActive = lastValue = scope.active);
                            }
                        }
                        return parentActive;
                    });
                }

                carouselCtrl.addSlide(scope, element);
                //when the scope is destroyed then remove the slide from the current slides array
                scope.$on('$destroy', function() {
                    carouselCtrl.removeSlide(scope);
                });

                scope.$watch('active', function(active) {
                    if (active) {
                        carouselCtrl.select(scope);
                    }
                });
            }
        };
    }]);


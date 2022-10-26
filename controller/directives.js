'use strict';

/* Directives */


var N_REGEX_INTEGER = /^\s*(\-|\+)?(\d*)\s*$/;
var N_REGEX_NUMBER = /^\s*(\-|\+)?(\d*|(\d*(\.\d*)))\s*$/;


angular.module('myApp.directives', [])

    .directive('serversidePaging', ['$compile', '$timeout', '$http', '$templateCache', function ($compile, $timeout, $http, $templateCache, $log) {
        return {
            restrict: 'A',
            scope: {
                paging: '=',
                search: '=',
                unsortWrapper: '@',
                filterWrapper: '@',
                resizable: '@'
            },
            link: function (scope, element, attrs) {

                if (!scope.paging) scope.paging = {};
                if (!scope.paging.sortBy) scope.paging.sortBy = [];

                // initial sort column and direction
                function init() {
                    // init sort
                    element.find('th').each(function (index, elem) {
                        var th = $(elem);
                        var model = th.attr('data-model') || th.attr('x-model') || th.attr('model');

                        if (model) {
                            var sort = _.find(scope.paging.sortBy, function (sort) {
                                return sort.column == model;
                            });

                            if (sort) {
                                th.addClass('sorting_' + sort.direction);
                            }
                            else {
                                th.addClass('sorting');
                            }
                        }

                        th = null;
                    });

                    // init unsort dropdown
                    if (scope.unsortWrapper) {
                        var template = '<div class="dropdown pull-right">' +
                            '<span class="btn btn-default fa fa-sort-amount-asc" data-toggle="dropdown"></span>' +
                            '<ul class="dropdown-menu unsort">' +
                            '<li data-ng-click="unsortOne(sort.column)" data-ng-repeat="sort in paging.sortBy"><i class="fa fa-times"></i> {{sort.label}}</li>' +
                            '<li data-ng-click="unsortAll()"><i class="fa fa-times"></i> Unsort All</li>' +
                            '</ul>' +
                            '</div>';

                        $timeout(function () {
                            $('#' + scope.unsortWrapper).append($compile(template)(scope));
                        }, 0);
                    }

                    // init filter dropdown
                    if (scope.filterWrapper) {
                        var template2 = '<div class="dropdown pull-right" style="margin-right: 4px;">' +
                            '<span class="btn btn-default fa fa-filter" data-toggle="dropdown"></span>' +
                            '<ul class="dropdown-menu unsort">';

                        element.find('thead tr:first-child th').each(function (index, elem) {
                            var filter = $(elem).attr('data-filter') || $(elem).attr('x-filter') || $(elem).attr('filter');

                            if (filter === 'true') {
                                var checked = element.hasClass('hide-col-' + (index + 1)) ? '' : 'checked';

                                template2 += '<li onclick="event.stopPropagation()"><input type="checkbox" data-ng-click="filterColumn(' + (index + 1) + ', $event)" ' + checked + ' > ' + $(elem).text() + '</li>';
                            }
                        });

                        template2 += '</ul>' +
                        '</div>';

                        $timeout(function () {
                            $('#' + scope.filterWrapper).append($compile(template2)(scope));
                        }, 0);
                    }
                }

                // filter handler
                scope.filterColumn = function (index, $event) {
                    if ($($event.target).prop('checked')) {
                        element.removeClass('hide-col-' + index);
                    }
                    else {
                        element.addClass('hide-col-' + index);
                    }
                };

                // init resizable th
                if (scope.resizable === 'true') {
                    $(element).resizable({
                        handles: 'e'
                    });

                    $(element).find("thead th").resizable({
                        handles: 'e'
                    });
                }


                // utility function for create sortBy array
                function toggleSort(sortBy, sortvalue, sortdir, sortlabel) {
                    if (sortdir) {
                        var obj = _.find(sortBy, function (obj) {
                            return obj.column == sortvalue;
                        });

                        if (obj) {
                            obj.direction = sortdir;
                        }
                        else {
                            sortBy.push({column: sortvalue, direction: sortdir, label: sortlabel});
                        }
                    }
                    else {
                        var index = 0;
                        var obj = _.find(sortBy, function (obj) {
                            return obj.column == sortvalue || ++index == sortBy.length && (index = -1);		// see http://stackoverflow.com/a/8065397
                        });

                        if (obj) {
                            sortBy.splice(index, 1);
                        }
                    }

                    return sortBy;
                };

                // table > th click handler
                var thClickHandler = function () {
                    var th = $(this);
                    var model = th.attr('data-model') || th.attr('x-model') || th.attr('model');

                    if (model) {
                        // set sorting direction
                        var sortDirection;
                        if (th.hasClass('sorting_asc')) {
                            th.removeClass('sorting_asc');
                            th.addClass('sorting_desc');
                            sortDirection = 'desc';
                        }
                        else if (th.hasClass('sorting_desc')) {
                            th.removeClass('sorting_desc');
                            th.addClass('sorting');
                            sortDirection = null;
                        }
                        else {
                            th.removeClass('sorting');
                            th.addClass('sorting_asc');
                            sortDirection = 'asc';
                        }

                        toggleSort(scope.paging.sortBy, model, sortDirection, th.text());

                        scope.search();
                        scope.$apply();
                    }

                    th = null;
                };

                // limit of table change handler
                var limitChangeHandler = function () {
                    var limit = $(this).val();
                    scope.paging.limit = limit;

                    scope.search();
                    scope.$apply();
                };

                // reset all sort
                scope.unsortAll = function () {
                    scope.paging.sortBy = [];
                    element.find('th').each(function (index, elem) {
                        var th = $(elem);
                        if (th.hasClass("sorting") || th.hasClass("sorting_asc") || th.hasClass("sorting_desc")) {
                            th.removeClass('sorting_asc');
                            th.removeClass('sorting_desc');
                            th.addClass('sorting');
                        }
                        th = null;
                    });

                    scope.search();
                };

                // remove sort one by one
                scope.unsortOne = function (model) {
                    var th = element.find('th[data-model="' + model + '"]') || element.find('th[x-model="' + model + '"]') || element.find('th[model="' + model + '"]');

                    th.removeClass('sorting_asc');
                    th.removeClass('sorting_desc');
                    th.addClass('sorting');

                    toggleSort(scope.paging.sortBy, model, null);

                    scope.search();

                    th = null;
                };

                // bind event
                element.find('th').on('click', thClickHandler);
                element.next().find('select').on('change', limitChangeHandler);

                // initial table
                init();

                // clean up
                scope.$on('$destroy', function () {
                    element.off();
                    element.find('th').off();
                    element.next().find('select').off();

                    if (scope.resizable === 'true') {
                        $(element).resizable('destroy');
                        $(element).find("thead th").resizable('destroy');
                    }
                });
            }
        };
    }])


    

    .directive('datadatepicker', function ($timeout) {
        console.log('date date picker');
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                element.datetimepicker({
                    format: APP.DATE_FORMAT,
                    pickTime: false,
                    useCurrent: false
                }).on('dp.change', function (e) {

                    ngModelCtrl.$setViewValue(e.date.format(APP.DATE_FORMAT));
                    scope.$apply();
                }).on('dp.error', function (e) {
                    element.find('input[type=text]').val('');
                    ngModelCtrl.$setViewValue(null);
                    scope.$apply();
                });
                $timeout(function () {
                    var initDate = scope.$eval(attrs['ngModel']);
                    if (initDate) {
                        element.data("DateTimePicker").setDateNotNotify(initDate);
                    }
                }, 0);
                scope.$watch(attrs['ngModel'], function (newVal, oldVal) {
                    element.data('DateTimePicker').setDateNotNotify(newVal);
                });

                scope.$on('$destroy', function () {
                    element.off();
                });
            }
        };
    })
    .directive('datepicker', function($timeout) {
        return {
            restrict : 'A',
            require : 'ngModel',
            link : function(scope, element, attrs, ngModelCtrl) {
                element.datetimepicker({
                    format : APP.DATE_FORMAT,
                    pickTime : false,
            useCurrent : false,
                }).on('dp.change', function(e) {
    //				ngModelCtrl.$setViewValue(e.date);
                    ngModelCtrl.$setViewValue(e.date.format(APP.DATE_FORMAT));
                    scope.$apply();
                }).on('dp.error', function(e) {
                    element.find('input[type=text]').val('');
                    ngModelCtrl.$setViewValue(null);
                    scope.$apply();
                });
                
                $timeout(function () {
                    var initDate = scope.$eval(attrs['ngModel']);
                    if (initDate) {
                        element.data("DateTimePicker").setDateNotNotify(initDate);
                    }
                }, 0);
                
                scope.$watch(attrs['ngModel'], function(newVal, oldVal) {
                    element.data('DateTimePicker').setDateNotNotify(newVal);
                });
                
                scope.$on('$destroy', function() {
                    element.off();
                });
            }
        };
    })

.directive('timepicker', function ($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                element.datetimepicker({
                    format: APP.TIME_FORMAT,
                    pickDate: false,
                    pick12HourFormat: false,



                }).on('dp.change', function (e) {
//              ngModelCtrl.$setViewValue(e.date);
                    ngModelCtrl.$setViewValue(e.date.format(APP.TIME_FORMAT));
                    scope.$apply();
                }).on('dp.error', function (e) {
                    element.find('input[type=text]').val('');
                    ngModelCtrl.$setViewValue(null);
                    scope.$apply();
                });

                $timeout(function () {
                    var initDate = scope.$eval(attrs['ngModel']);
                    if (initDate) {
                        element.data("DateTimePicker").setDateNotNotify(initDate);
                    }
                }, 0);

                scope.$watch(attrs['ngModel'], function (newVal, oldVal) {
                    element.data('DateTimePicker').setDateNotNotify(newVal);
                });

                scope.$on('$destroy', function () {
                    element.off();
                });
            }
        };
    })
    .directive('iCheck', function ($timeout) {
//    return {
//    	require : '?ngModel',
//        link: function(scope, element, attrs, ngModelCtrl) {
//        	if (ngModelCtrl) {
//        		element.on('ifChecked', function(event){
//        			ngModelCtrl.$setViewValue(element.val());
//    				scope.$apply();
//        		});
//        	}
//
//        	element.iCheck({
//        		checkboxClass: 'icheckbox_minimal',
//        		radioClass: 'iradio_minimal'
//            });
//
//        	scope.$on('$destroy', function() {
//        		element.iCheck('destroy');
//			});
//        }
//    };
        return {
            require: '?ngModel',
            link: function ($scope, element, $attrs, ngModel) {
                return $timeout(function () {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function (newValue) {
                        $(element).iCheck('update');
                    });

                    $scope.$on('$destroy', function () {
                        element.iCheck('destroy');
                    });

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_minimal',
                        radioClass: 'iradio_minimal',
                        increaseArea: '20%'
                    }).on('ifChanged', function (event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function () {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function () {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    })

    .directive('draggable',function(){
     return function(scope, element, attrs){

          element.each(function () {
            console.log(scope.w);
            
            // create an Event Object
            // it doesn't need to have a start or end
            var eventObject = {
             title: scope.w.wl_name, // use the element's text as the event title
   			 wl_id: scope.w.wl_id,
             wl_hr: scope.w.wl_hr,
             ot:  scope.w.wl_ot,
             bg:  scope.w.wl_color,
             original:scope.w.wl_name,
             period: scope.w.wl_category,
             bgtime:scope.w.wl_time_bg,
             mm:scope.w.wl_mm
            };
            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);
            // make the event draggable using jQuery UI
            $(this).draggable({
              zIndex: 1070,
              revert: true, // will cause the event to go back to its
              revertDuration: 0  //  original position after the drag
            });

          });
      }
})










    .directive('iCheckAll', function () {
        return {
            link: function (scope, element, attrs) {
                var name = attrs.iCheckAll;

                element.on('ifChecked', function (event) {
                    $('input[name=' + name + ']').iCheck('check');
                });

                element.on('ifUnchecked', function (event) {
                    $('input[name=' + name + ']').iCheck('uncheck');
                });

                element.iCheck({
                    checkboxClass: 'icheckbox_minimal',
                    radioClass: 'iradio_minimal'
                });

                scope.$on('$destroy', function () {
                    element.iCheck('destroy');
                    element.off();
                });
            }
        };
    })

    .directive('boxCollapse', ['$translate', function ($translate) {
        return {
            link: function (scope, element, attrs) {
//        	element.tooltip('destroy');
//        	if (!$(this).parents(".box").first().hasClass("collapsed-box")) {
//        		element.tooltip({title: $translate.instant("Collapse")});
//        	} else {
//        		element.tooltip({title: $translate.instant("Expand")});
//        	}

                var toggleBox = function () {
//        		element.tooltip('destroy');
                    var box = $(this).parents(".box").first();
                    //Find the body and the footer
                    var bf = box.find(".box-body, .box-footer");
                    var bt = $(this).find("i");
                    if (!box.hasClass("collapsed-box")) {
                        box.addClass("collapsed-box");
                        bf.slideUp();
                        bt.removeClass("fa fa-chevron-up").addClass("fa fa-chevron-down");
//                  element.tooltip({title: $translate.instant("Expand")});
                    } else {
                        box.removeClass("collapsed-box");
                        bf.slideDown();
                        bt.removeClass("fa fa-chevron-down").addClass("fa fa-chevron-up");
//                  element.tooltip({title: $translate.instant("Collapse")});
                    }
                    bt = null;
                    bf = null;
                    box = null;
                };

                element.on('click', toggleBox);

                scope.$on('$destroy', function () {
                    element.off('click', toggleBox);
                });
            }
        };
    }])

    .directive('formCollapse', ['$translate', function ($translate) {
        return {
            link: function (scope, element, attrs) {
//        	element.tooltip('destroy');
//        	if (!$(this).parents(".box").first().hasClass("collapsed-box")) {
//        		element.tooltip({title: $translate.instant("Collapse")});
//        	} else {
//        		element.tooltip({title: $translate.instant("Expand")});
//        	}
                $('#panel2').hide();
                var toggleBox = function () {
//        		element.tooltip('destroy');
                    var box = $(this).parents(".form-group").first();
                    //Find the body and the footer
                    var bf = box.find("#panel2");
                    var bt = $(this).find("i");
                    if (!bt.hasClass("fa fa-plus")) {
                        box.addClass("fa fa-plus");
                        bf.slideUp();
                        bt.removeClass("fa fa-plus").addClass("fa fa-minus");
//                  element.tooltip({title: $translate.instant("Expand")});
                    } else {
                        box.removeClass("fa fa-plus");
                        bf.slideDown();
                        bt.removeClass("fa fa-minus").addClass("fa fa-plus");
//                  element.tooltip({title: $translate.instant("Collapse")});
                    }
                    bt = null;
                    bf = null;
                    box = null;
                };

                element.on('click', toggleBox);

                scope.$on('$destroy', function () {
                    element.off('click', toggleBox);
                });
            }
        };
    }])

    .directive('ngxInteger', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModelController) {
                var opts = {
                        // min: a,
                        // max: b
                    },
                    config = scope.$eval(attrs.ngxInteger) || {};

                angular.extend(opts, config);

                var getPrevValue = function () {
                    return element.data('prevValue');
                };

                var setPrevValue = function (value) {
                    element.data('prevValue', value);
                };

                var updateModel = function () {
                    var newValue = element.val();

                    scope.$apply(function () {
                        if (newValue) {
                            if (isNaN(newValue * 1)) {
                                ngModelController.$setViewValue('');
                            }
                            else {
                                ngModelController.$setViewValue(newValue * 1);
                            }
                        }
                        else {
                            ngModelController.$setViewValue(newValue);
                        }
                    });
                };

                if (ngModelController) {
                    ngModelController.$render = function () {
                        if (angular.isDefined(ngModelController.$viewValue)) {
                            element.val(ngModelController.$viewValue);
                            setPrevValue(ngModelController.$viewValue);
                        }
                        else {
                            element.val('');
                            setPrevValue('');
                        }
                    };
                }
                else {
                    setPrevValue('');
                }

                element.bind('keyup', function () {

                    element.val($.trim(element.val()));

                    var pass = true,
                        value = element.val(),
                        match = value === '' || N_REGEX_INTEGER.test(value);

                    // check N_REGEX_INTEGER
                    if (match) {
                        // add 0 when value in ('+', '-')
                        if (value === '+' || value === '-') value += '0';

                        // check min, max
                        if (angular.isDefined(opts.min) && value < opts.min) {
                            pass = false;
                        }
                        else if (angular.isDefined(opts.max) && value > opts.max) {
                            pass = false;
                        }
                    }
                    else {
                        pass = false;
                    }

                    // when not pass then -> restore previous value
                    if (!pass) {
                        element.val(getPrevValue());
                    }
                    else {
                        setPrevValue(element.val());
                    }

                    if (ngModelController) {
                        updateModel();
                    }
                });

                element.bind('drop', function (e) {
                    e.preventDefault();
                });
            }
        };
    })

    .directive('ngxNumber', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModelController) {
                var opts = {
                        // min: a,
                        // max: b,
                        // decimal: c
                        // maxLength: d
                    },
                    config = scope.$eval(attrs.ngxNumber) || {};

                angular.extend(opts, config);

                var getPrevValue = function () {
                    return element.data('prevValue');
                };

                var setPrevValue = function (value) {
                    element.data('prevValue', value);
                };

                var updateModel = function () {
                    var newValue = element.val();

                    scope.$apply(function () {
                        if (newValue) {
                            if (isNaN(newValue * 1)) {
                                ngModelController.$setViewValue('');
                            }
                            else {
                                ngModelController.$setViewValue(newValue * 1);
                            }
                        }
                        else {
                            ngModelController.$setViewValue(newValue);
                        }
                    });
                };

                if (ngModelController) {
                    ngModelController.$render = function () {
                        if (angular.isDefined(ngModelController.$viewValue)) {
                            element.val(ngModelController.$viewValue);
                            setPrevValue(ngModelController.$viewValue);
                        }
                        else {
                            element.val('');
                            setPrevValue('');
                        }
                    };
                }
                else {
                    setPrevValue('');
                }

                element.bind('keyup', function () {

                    element.val($.trim(element.val()));

                    var pass = true,
                        value = element.val(),
                        match = value === '' || N_REGEX_NUMBER.test(value);

                    // check N_REGEX_NUMBER
                    if (match) {
                        // add 0 when value in ('+', '-')
                        if (value === '+' || value === '-') value += '0';

                        // check min, max, decimal, maxLength
                        if (angular.isDefined(opts.min) && value < opts.min) {
                            pass = false;
                        }
                        else if (angular.isDefined(opts.max) && value > opts.max) {
                            pass = false;
                        }
                        else if (angular.isDefined(opts.decimal) && value.indexOf('.') > -1 && value.substring(value.indexOf('.') + 1).length > opts.decimal) {
                            pass = false;
                        }
                        else if (angular.isDefined(opts.maxLength) && value.substring(value.indexOf('.') + 1).length > opts.maxLength) {
                            pass = false;
                        }
                    }
                    else {
                        pass = false;
                    }

                    // when not pass then -> restore previous value
                    if (!pass) {
                        element.val(getPrevValue());
                    }
                    else {
                        setPrevValue(element.val());
                    }

                    if (ngModelController) {
                        updateModel();
                    }
                });

                element.bind('drop', function (e) {
                    e.preventDefault();
                });
            }
        };
    })


    .directive('ngValid', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function (val) {
                    // var clean = val.replace( /[^a-z_0-9]+/g, '');

                    var clean = null;
                    if (val) {
                        if (attrs.ngValid === 'a-z_0-9') {
                            clean = val.replace(/[^a-z_0-9]+/g, '');
                        }
                        else if (attrs.ngValid === 'a-z_A-Z-0-9') {
                            clean = val.replace(/[^a-z_A-Z-0-9]+/g, '');
                        }

                        if (val !== clean) {
                            ngModelCtrl.$setViewValue(clean);
                            ngModelCtrl.$render();
                        }
                    }

                    return clean;
                });

                element.bind('keypress', function (event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        };
    })


    .directive('checkboxAll', function () {
        return function (scope, iElement, iAttrs) {
            var parts = iAttrs.checkboxAll.split('.');

//    iElement.attr('type','checkbox');
            iElement.bind('change', function (evt) {
                scope.$apply(function () {
                    var setValue = iElement.prop('checked');
                    angular.forEach(scope.$eval(parts[0]), function (v) {
                        v[parts[1]] = setValue;
                    });
                });
            });
            scope.$watch(parts[0], function (newVal) {
                var hasTrue = false
                    , hasFalse = false;
                angular.forEach(newVal, function (v) {
                    if (v[parts[1]]) {
                        hasTrue = true;
                    } else {
                        hasFalse = true;
                    }
                });
                if (hasTrue && hasFalse) {
                    iElement.attr('checked', false);
                } else {
                    iElement.attr('checked', hasTrue);
                }
            }, true);
        };
    })


    .directive('ngxSwitchCriteria', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                var target = '#' + attrs.ngxSwitchCriteria;
                var listenToView = function () {
                    element.on('switch-change', function (e, data) {
                        var value = data.value;
                        if (value) {
                            $(target).slideDown('fast', function () {
                                $(target).removeClass('hide');
                            });
                        } else {
                            $(target).slideUp('fast', function () {
                                $(target).addClass('hide');
                            });
                        }
                    });
                };
                $timeout(function () {
                    element.bootstrapSwitch();
                    listenToView();
                });
                scope.$on('$destroy', function () {
                    element.bootstrapSwitch('destroy');
                });
            }
        };
    }])
    .directive('multiSelect', function($q) {
          return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
              selectedLabel: "@",
              availableLabel: "@",
              displayAttr: "@",
              available: "=",
              model: "=ngModel"
            },
            templateUrl: 'template/multiselect/muti-select.html',
            link: function(scope, elm, attrs) {
              scope.selected = {
                available: [],
                current: []
              };

      /* Handles cases where scope data hasn't been initialized yet */
      var dataLoading = function(scopeAttr) {
        var loading = $q.defer();
        if(scope[scopeAttr]) {
          loading.resolve(scope[scopeAttr]);
        } else {
          scope.$watch(scopeAttr, function(newValue, oldValue) {
            if(newValue !== undefined)
              loading.resolve(newValue);
          });
        }
        return loading.promise;
      };

      /* Filters out items in original that are also in toFilter. Compares by reference. */
      var filterOut = function(original, toFilter) {
        var filtered = [];
        angular.forEach(original, function(entity) {
          var match = false;
          for(var i = 0; i < toFilter.length; i++) {
            if(toFilter[i][attrs.displayAttr] == entity[attrs.displayAttr]) {
              match = true;
              break;
            }
          }
          if(!match) {
            filtered.push(entity);
          }
        });
        return filtered;
      };

      scope.refreshAvailable = function() {

        scope.available = filterOut(scope.available, scope.model);

        scope.selected.available = [];
        scope.selected.current = [];
      };

      scope.add = function() {

        scope.model = scope.model.concat(scope.selected.available);
        scope.refreshAvailable();
      };
      scope.remove = function() {
        scope.available = scope.available.concat(scope.selected.current);
        scope.model = filterOut(scope.model, scope.selected.current);
        scope.refreshAvailable();
      };

      $q.all([dataLoading("model"), dataLoading("available")]).then(function(results) {
        scope.refreshAvailable();
      });
    }
  };
})

    .value('ui.config', {})


    .directive('myEnter', function () {
      return function (scope, element, attrs) {
          element.bind("keydown keypress", function (event) {
              if(event.which === 13) {
                  scope.$apply(function (){
                      scope.$eval(attrs.myEnter);
                  });

                  event.preventDefault();
              }
          });
      };
  })



    .directive('uiDate', ['ui.config', function (uiConfig) {
        'use strict';
        var options;
        options = {};
        if (angular.isObject(uiConfig.date)) {
            angular.extend(options, uiConfig.date);
        }
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, controller) {
                var getOptions = function () {
                    return angular.extend({}, uiConfig.date, scope.$eval(attrs.uiDate));
                };
                var initDateWidget = function () {
                    var opts = getOptions();

                    // If we have a controller (i.e. ngModelController) then wire it up
                    if (controller) {
                        var updateModel = function () {
                            scope.$apply(function () {
//              var date = element.datepicker("getDate");
//              element.datepicker("setDate", element.val());
//              var date = element.val();
                                var date = element.children('input[type=text]').val();
                                controller.$setViewValue(date);
                                element.blur();
                            });
                        };
                        if (opts.onSelect) {
                            // Caller has specified onSelect, so call this as well as updating the model
                            var userHandler = opts.onSelect;
                            opts.onSelect = function (value, picker) {
                                updateModel();
                                scope.$apply(function () {
                                    userHandler(value, picker);
                                });
                            };
                        } else {
                            // No onSelect already specified so just update the model
                            opts.onSelect = updateModel;
                        }
                        // In case the user changes the text directly in the input box
                        element.bind('change', updateModel);


                        // Update the date picker when the model changes
                        controller.$render = function () {
                            var date = controller.$viewValue;
//            if ( angular.isDefined(date) && date !== null && !angular.isDate(date) ) {
//              throw new Error('ng-Model value must be a Date object - currently it is a ' + typeof date + ' - use ui-date-format to convert it from a string');
//            }
//            element.datepicker("setValue", date);
                            element.datepicker(opts);

                            if (angular.isDefined(date) && date !== null && date !== '') {
//            	element.children('input[type=text]').val(date);
                                var strDate = date;
                                var dateParts = strDate.split("/");

                                var newDate = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);

                                element.datepicker('setValue', newDate);
                            } else {
                                this.value = '';
                                element.children('input[type=text]').val('');
                                controller.$setViewValue('');
                            }
                        };
                    }
                    // If we don't destroy the old one it doesn't update properly when the config changes
//        element.datepicker('destroy');
                    // Create the new datepicker widget
                    element.datepicker(opts);
                    var textbox = element.children('input[type=text]');
                    textbox.on('focus', function (ev) {
                        this.value = '';
                        updateModel();
                    });
                    textbox.on('keydown', function (ev) {
                        return false;
                    });
                    if (controller) {
                        // Force a render to override whatever is in the input text box
                        controller.$render();
                    }
                };
                // Watch for changes to the directives options
                scope.$watch(getOptions, initDateWidget, true);
            }
        };
    }
    ])

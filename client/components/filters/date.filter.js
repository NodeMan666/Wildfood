'use strict';
angular
		.module('wildfoodApp.filters')
		.filter(
				'dynamicDate',
				[
						'$filter',
						'Utils',
						function($filter,Utils) {
							return function(date) {
								if (date != null) {


									if (withInToday($filter, date)) {
										return $filter('date')(date,
												'MMM d, yyyy h:mm a');
//									} else if (withInThisYear($filter, date)) {
//										return $filter('date')(date, 'MMM d');
									} else {
										return $filter('date')(date,
												'MMM d, yyyy');
									}

									// return $filter('date')(date,
									// 'MMM d, yyyy h:mm a');

								}

								function withInToday($filter, date) {
									var current = new Date();
									var yearOnlyForDate = $filter('date')(date,
											'MMM d, yyyy');
									var yearOnlyForCurrent = $filter('date')(
											current, 'MMM d, yyyy');
									return yearOnlyForDate == yearOnlyForCurrent;
								}

								function withInThisYear($filter, date) {
									var current = new Date();
									var yearOnlyForDate = $filter('date')(date,
											'yyyy');
									var yearOnlyForCurrent = $filter('date')(
											current, 'yyyy');
									return yearOnlyForDate == yearOnlyForCurrent;
								}

								return "Unknown";
							};
						} ]);

angular.module('wildfoodApp.filters').filter('fulldate',
		[ '$filter', 'Utils', function($filter, Utils) {
			return function(date) {
				if (date != null) {
					return $filter('date')(date, 'MMM d, yyyy h:mm a');
				}

				return "";
			};
		} ]);

angular.module('wildfoodApp.filters').filter('datenotime',
	[ '$filter', 'Utils', function($filter, Utils) {
		return function(date) {
			if (date != null) {
				return $filter('date')(date, 'MMM d, yyyy');
			}

			return "";
		};
	} ]);

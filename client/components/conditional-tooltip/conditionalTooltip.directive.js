'use strict';
angular
		.module('wildfoodApp.conditionalTooltip', [ 'ui.bootstrap' ])
		.directive(
				'conditionalTooltip15Popup',
				[
						'$sce',
						'$templateCache',
						'$compile',
						function($sce, $templateCache, $compile) {
							return {
								restrict : 'EA',
								replace : true,
								scope : {
									title : '@',
									content : '@',
									placement : '@',
									animation : '&',
									isOpen : '&'
								},
								templateUrl : 'components/conditional-tooltip/conditional-tooltip.tpl.html',
								link : function(scope, elem, attrs) {
									var content = attrs['content'];
									if (content.length > 15) {
										scope.showTooltip = true;
									} else {
										scope.showTooltip = false;
									}
									scope.$parent.tt_placement = 'right';

								}
							};
						} ])
		.directive('conditionalTooltip15', [ '$tooltip', function($tooltip) {
			return $tooltip('conditionalTooltip15', 'popover', 'mouseenter');
		} ])
		.directive(
				'conditionalTooltip30Popup',
				[
						'$sce',
						'$templateCache',
						'$compile',
						function($sce, $templateCache, $compile) {
							return {
								restrict : 'EA',
								replace : true,
								scope : {
									title : '@',
									content : '@',
									placement : '@',
									animation : '&',
									isOpen : '&'
								},
								templateUrl : 'components/conditional-tooltip/conditional-tooltip.tpl.html',
								link : function(scope, elem, attrs) {
									var content = attrs['content'];
									if (content.length > 30) {
										scope.showTooltip = true;
									} else {
										scope.showTooltip = false;
									}
									scope.$parent.tt_placement = 'right';

								}
							};
						} ])
		.directive('conditionalTooltip30', [ '$tooltip', function($tooltip) {
			return $tooltip('conditionalTooltip30', 'popover', 'mouseenter');
		} ])
		.directive(
				'conditionalTooltipCutSentencePopup',
				[
						'$sce',
						'$templateCache',
						'$compile',
						function($sce, $templateCache, $compile) {
							return {
								restrict : 'EA',
								replace : true,
								scope : {
									title : '@',
									content : '@',
									placement : '@',
									animation : '&',
									isOpen : '&'
								},
								templateUrl : 'components/conditional-tooltip/conditional-tooltip.tpl.html',
								link : function(scope, elem, attrs) {
									var content = attrs['content'];
									scope.$parent.tt_placement = 'right';

									var result = cutSentence(content);

									if (result == content) {
										scope.showTooltip = false;
									} else {
										scope.showTooltip = true;
									}

								}
							};
						} ]).directive(
				'conditionalTooltipCutSentence',
				[
						'$tooltip',
						function($tooltip) {
							return $tooltip('conditionalTooltipCutSentence',
									'popover', 'mouseenter');
						} ]);


angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('components/main/main.view.html','<div ui-view="mainContent" flex="" layout="column"></div>');
$templateCache.put('components/weather/weather.view.html','<div layout="row" layout-align="center center" flex="100">\n    <div class="md-whiteframe-z2" flex="" flex-gt-sm="40">\n        <md-toolbar class="site-toolbar site-center">\n            <h1 class="md-headline">{{ "WEATHER" | translate }}</h1>\n        </md-toolbar>\n        <md-content class="site-center" md-theme="dark" layout="column" layout-padding=""><span>{{ "WEATHER_TEXT" | translate }}</span></md-content>\n        <md-content class="site-pad-left site-pad-right" flex="" layout="column">\n            <form name="zipForm" ng-model-options="{ debounce: 250 }">\n                <div layout="row">\n                    <md-input-container class="site-no-margin-bottom" flex=""><label>{{ "ZIP_CODE" | translate }}</label><input class="md-headline site-center" name="zip" ng-model="vm.zip" ng-change="vm.resetNotValid()" ng-keyup="$event.keyCode === 13 &amp;&amp; zipForm.$valid &amp;&amp; vm.getItAll(vm.zip)"\n                            ng-pattern="vm.zipRegex" required="" />\n                        <div ng-messages="zipForm.zip.$error" multiple="multiple" md-auto-hide="false">\n                            <div ng-message="required">{{ "ERROR_REQUIRED" | translate }}</div>\n                            <div ng-message="pattern">{{ "ERROR_PATTERN" | translate }}</div>\n                        </div>\n                    </md-input-container>\n                </div>\n                <div layout="row" layout-align="center center">\n                    <md-button class="md-primary md-raised" md-theme="buttons" ng-click="vm.getItAll(vm.zip)" ng-disabled="!zipForm.$valid">{{ "CHECK" | translate }}</md-button>\n                </div>\n            </form>\n        </md-content>\n        <md-progress-linear class="site-blue" md-mode="indeterminate" ng-show="vm.loading"></md-progress-linear>\n        <md-content class="site-center" layout="column" ng-show="vm.hasWeather" layout-padding=""><span>It\'s currently {{ vm.weather.temperature }}&#8457; in {{ vm.weather.cityName }}. The timezone for the area is {{ vm.weather.timezone }} and the elevation is {{ vm.weather.elevation }} meters.</span></md-content>\n    </div>\n</div>');}]);
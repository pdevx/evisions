angular.module("translations", ['pascalprecht.translate']).config(["$translateProvider", function($translateProvider) {
$translateProvider.translations("en", {
  "CHECK": "Check",
  "ERROR_PATTERN": "Zip code should be a 5 digit number.",
  "ERROR_REQUIRED": "This field is required.",
  "INVALID_TEXT": "The zip code provided is invalid. Please try a different zip code.",
  "INVALID_TITLE": "Invalid Zip Code",
  "OK": "Okay",
  "WEATHER": "How's the weather today?",
  "WEATHER_TEXT": "What's the weather like in your area? Enter your zip code below to find out.",
  "ZIP_CODE": "Zip code"
});
}]);

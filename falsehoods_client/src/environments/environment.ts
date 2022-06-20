// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  falsehood_user_string: "@test.trecapps.com",
  falsehood_user_url: "",
  // falsehood_search_url: "https://trec-apps-test-falsehoods-search.azurewebsites.net/Search",
  // falsehood_submit_url: "https://trec-apps-test-falsehood-submit.azurewebsites.net/Update",
  // falsehood_review_url: "https://trec-apps-test-falsehood-review.azurewebsites.net/Review",
  falsehood_search_url: "http://localhost:4200/Review/",
  falsehood_submit_url: "http://localhost:4200/submit/",
  falsehood_review_url: "http://localhost:4200/search/",
  resource_url: "http://localhost:4200/resources/search/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

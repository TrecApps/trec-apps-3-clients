// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //user_service_url: 'https://azurewebsites.net/'
  //user_service_url: 'https://trecappsusertest.azurewebsites.net/',
  user_admin_url: 'https://trec-apps-test-admin.azurewebsites.net/',

// testing on localhost

  // user_service_url: 'http://localhost:4200/User-api/',
  // user_subscription_url: 'http://localhost:4200/sub/',


  // image_service_url: "http://localhost:4200/Images-api/",
  // profile_service_url: "http://localhost:4200/Coffeeshop-Profile-api/",
  // post_service_url: "http://localhost:4200/Coffeeshop-Content-api/",
  // comment_service_url:"http://localhost:4200/Coffeeshop-Content-api/",
  // resource_service_url: "http://localhost:4200/Brands-api/",

  // messaging_service_url: "http://localhost:4200/Message-api/",

 // Test environment

  user_service_url: 'https://test.trecapps.com/User-api/',
  //user_subscription_url: 'http://localhost:4200/sub/',



  image_service_url: "https://test.trecapps.com/Images-api/",
  profile_service_url: "https://test.trecapps.com/Coffeeshop-Profile-api/",
  post_service_url: "https://test.trecapps.com/Coffeeshop-Content-api/",
  comment_service_url:"https://test.trecapps.com/Coffeeshop-Content-api/",
  resource_service_url: "https://test.trecapps.com/Brands-api/",

  messaging_service_url: "https://test.trecapps.com/Message-api/",

  app_name: "Coffee-Shop"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

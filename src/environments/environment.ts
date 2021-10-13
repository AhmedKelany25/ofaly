// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const serviceSid = 'ISc33c2deedb721a0da3fedaaace62c7c5';
const host = '167.99.252.197';

export const environment = {
  production: false,
  userApi: `http://${host}:8010`,
  chat: {
    api: `http://${host}:8020/API/Services/${serviceSid}`,
    ws: `ws://${host}:8020/SDK/Services/${serviceSid}`,
  },
  shop: {
    management: `http://${host}:8030/API`,
    inventory: `http://${host}:8031/API`,
    pos: `http://${host}:8032/API`,
  },
  healthApi: 'https://ofaly-health.herokuapp.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

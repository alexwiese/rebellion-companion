// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
   baseUrl: "http://localhost:52070/" // From Visual Studio (localhost instead of windows on windows machine)
  // baseUrl: "http://localhost:14751/" // From local/windows IIS
  // baseUrl: "http://aediledhf.azurewebsites.net/" // From Azure
}

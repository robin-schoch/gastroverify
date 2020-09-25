import 'hammerjs';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import API from '@aws-amplify/api';
import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import awsconfig from './aws-exports';
import {Auth} from 'aws-amplify';

if (environment.production) {
    enableProdMode();
}

let config = Object.assign(
    {},
    awsconfig,
    {}
);
config.aws_cloud_logic_custom[0] = Object.assign(
    {},
    config.aws_cloud_logic_custom[0],
    {
        custom_header: async () => {
            return {'X-ID-Token': `${(await Auth.currentSession()).getIdToken().getJwtToken()}`};
            // Alternatively, with Cognito User Pools use this:
            // return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
            // return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
        }
    }
);

const a = API.configure(config);


platformBrowserDynamic().bootstrapModule(AppModule)
                        .catch(err => console.error(err));

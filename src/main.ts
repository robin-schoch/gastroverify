import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import API from '@aws-amplify/api';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import awsconfig from './aws-exports';
if (environment.production) {
  enableProdMode();
}



API.configure(awsconfig);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

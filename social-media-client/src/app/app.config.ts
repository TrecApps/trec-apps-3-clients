import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { } from '@angular/forms';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withFetch()), provideAnimations(), provideAnimationsAsync()]
};

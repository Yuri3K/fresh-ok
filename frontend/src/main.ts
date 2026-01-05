import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  // Yдаляет из DOM дерева прелоадер, который отображается 
  // во время холодного старта сервера
  .then(() => {
    const preloader = document.getElementById('app-preloader');
    if (preloader) {
      preloader.remove();
    }
  })
  .catch((err) => console.error(err));

import EmberRouter from '@ember/routing/router';
import config from 'terminal-dot-shop/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('coffees');
  this.route('auth', function () {
    this.route('callback');
  });
  this.route('login');
});

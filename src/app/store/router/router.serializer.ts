import {RouterState} from './router.state';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

interface RouterStateSerializer<T> {
}

export class RouterSerializer implements RouterStateSerializer<RouterState> {
  serialize(routerState: RouterStateSnapshot): RouterState {
    let route: ActivatedRouteSnapshot = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }
    const {params} = route;
    const {url, root: {queryParams},} = routerState;

    return {url, params, queryParams};
  }
}

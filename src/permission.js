import router from './router'
import {constantRouterMap, patientRouterMap} from "./router";

export function getPermission() {

    let array = constantRouterMap.concat(patientRouterMap);
    router.options.routes = array;
    router.onReady(() => {
      router.addRoutes(array)
    });
}

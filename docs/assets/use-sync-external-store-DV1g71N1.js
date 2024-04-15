var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});import{r as reactExports}from"./react-B1yKWjgZ.js";var withSelector={exports:{}},withSelector_production_min={},shim={exports:{}},useSyncExternalStoreShim_production_min={};/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var e=reactExports;function h$1(a,b){return a===b&&(a!==0||1/a===1/b)||a!==a&&b!==b}__name(h$1,"h$1");var k=typeof Object.is=="function"?Object.is:h$1,l=e.useState,m=e.useEffect,n$1=e.useLayoutEffect,p$1=e.useDebugValue;function q$1(a,b){var d=b(),f=l({inst:{value:d,getSnapshot:b}}),c=f[0].inst,g=f[1];return n$1(function(){c.value=d,c.getSnapshot=b,r$1(c)&&g({inst:c})},[a,d,b]),m(function(){return r$1(c)&&g({inst:c}),a(function(){r$1(c)&&g({inst:c})})},[a]),p$1(d),d}__name(q$1,"q$1");function r$1(a){var b=a.getSnapshot;a=a.value;try{var d=b();return!k(a,d)}catch{return!0}}__name(r$1,"r$1");function t$1(a,b){return b()}__name(t$1,"t$1");var u$1=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?t$1:q$1;useSyncExternalStoreShim_production_min.useSyncExternalStore=e.useSyncExternalStore!==void 0?e.useSyncExternalStore:u$1;shim.exports=useSyncExternalStoreShim_production_min;var shimExports=shim.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h=reactExports,n=shimExports;function p(a,b){return a===b&&(a!==0||1/a===1/b)||a!==a&&b!==b}__name(p,"p");var q=typeof Object.is=="function"?Object.is:p,r=n.useSyncExternalStore,t=h.useRef,u=h.useEffect,v=h.useMemo,w=h.useDebugValue;withSelector_production_min.useSyncExternalStoreWithSelector=function(a,b,e2,l2,g){var c=t(null);if(c.current===null){var f={hasValue:!1,value:null};c.current=f}else f=c.current;c=v(function(){function a2(a3){if(!c2){if(c2=!0,d2=a3,a3=l2(a3),g!==void 0&&f.hasValue){var b2=f.value;if(g(b2,a3))return k2=b2}return k2=a3}if(b2=k2,q(d2,a3))return b2;var e3=l2(a3);return g!==void 0&&g(b2,e3)?b2:(d2=a3,k2=e3)}__name(a2,"a");var c2=!1,d2,k2,m2=e2===void 0?null:e2;return[function(){return a2(b())},m2===null?void 0:function(){return a2(m2())}]},[b,e2,l2,g]);var d=r(a,c[0],c[1]);return u(function(){f.hasValue=!0,f.value=d},[d]),w(d),d};withSelector.exports=withSelector_production_min;var withSelectorExports=withSelector.exports;export{withSelectorExports as w};
//# sourceMappingURL=use-sync-external-store-DV1g71N1.js.map

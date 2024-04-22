var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});var scheduler={exports:{}},scheduler_production_min={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(exports){function f(a,b){var c=a.length;a.push(b);a:for(;0<c;){var d=c-1>>>1,e=a[d];if(0<g(e,b))a[d]=b,a[c]=e,c=d;else break a}}__name(f,"f");function h(a){return a.length===0?null:a[0]}__name(h,"h");function k(a){if(a.length===0)return null;var b=a[0],c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length,w=e>>>1;d<w;){var m=2*(d+1)-1,C=a[m],n=m+1,x=a[n];if(0>g(C,c))n<e&&0>g(x,C)?(a[d]=x,a[n]=c,d=n):(a[d]=C,a[m]=c,d=m);else if(n<e&&0>g(x,c))a[d]=x,a[n]=c,d=n;else break a}}return b}__name(k,"k");function g(a,b){var c=a.sortIndex-b.sortIndex;return c!==0?c:a.id-b.id}if(__name(g,"g"),typeof performance=="object"&&typeof performance.now=="function"){var l=performance;exports.unstable_now=function(){return l.now()}}else{var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q}}var r=[],t=[],u=1,v=null,y=3,z=!1,A=!1,B=!1,D=typeof setTimeout=="function"?setTimeout:null,E=typeof clearTimeout=="function"?clearTimeout:null,F=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function G(a){for(var b=h(t);b!==null;){if(b.callback===null)k(t);else if(b.startTime<=a)k(t),b.sortIndex=b.expirationTime,f(r,b);else break;b=h(t)}}__name(G,"G");function H(a){if(B=!1,G(a),!A)if(h(r)!==null)A=!0,I(J);else{var b=h(t);b!==null&&K(H,b.startTime-a)}}__name(H,"H");function J(a,b){A=!1,B&&(B=!1,E(L),L=-1),z=!0;var c=y;try{for(G(b),v=h(r);v!==null&&(!(v.expirationTime>b)||a&&!M());){var d=v.callback;if(typeof d=="function"){v.callback=null,y=v.priorityLevel;var e=d(v.expirationTime<=b);b=exports.unstable_now(),typeof e=="function"?v.callback=e:v===h(r)&&k(r),G(b)}else k(r);v=h(r)}if(v!==null)var w=!0;else{var m=h(t);m!==null&&K(H,m.startTime-b),w=!1}return w}finally{v=null,y=c,z=!1}}__name(J,"J");var N=!1,O=null,L=-1,P=5,Q=-1;function M(){return!(exports.unstable_now()-Q<P)}__name(M,"M");function R(){if(O!==null){var a=exports.unstable_now();Q=a;var b=!0;try{b=O(!0,a)}finally{b?S():(N=!1,O=null)}}else N=!1}__name(R,"R");var S;if(typeof F=="function")S=__name(function(){F(R)},"S");else if(typeof MessageChannel<"u"){var T=new MessageChannel,U=T.port2;T.port1.onmessage=R,S=__name(function(){U.postMessage(null)},"S")}else S=__name(function(){D(R,0)},"S");function I(a){O=a,N||(N=!0,S())}__name(I,"I");function K(a,b){L=D(function(){a(exports.unstable_now())},b)}__name(K,"K"),exports.unstable_IdlePriority=5,exports.unstable_ImmediatePriority=1,exports.unstable_LowPriority=4,exports.unstable_NormalPriority=3,exports.unstable_Profiling=null,exports.unstable_UserBlockingPriority=2,exports.unstable_cancelCallback=function(a){a.callback=null},exports.unstable_continueExecution=function(){A||z||(A=!0,I(J))},exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<a?Math.floor(1e3/a):5},exports.unstable_getCurrentPriorityLevel=function(){return y},exports.unstable_getFirstCallbackNode=function(){return h(r)},exports.unstable_next=function(a){switch(y){case 1:case 2:case 3:var b=3;break;default:b=y}var c=y;y=b;try{return a()}finally{y=c}},exports.unstable_pauseExecution=function(){},exports.unstable_requestPaint=function(){},exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=y;y=a;try{return b()}finally{y=c}},exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();switch(typeof c=="object"&&c!==null?(c=c.delay,c=typeof c=="number"&&0<c?d+c:d):c=d,a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1e4;break;default:e=5e3}return e=c+e,a={id:u++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1},c>d?(a.sortIndex=c,f(t,a),h(r)===null&&a===h(t)&&(B?(E(L),L=-1):B=!0,K(H,c-d))):(a.sortIndex=e,f(r,a),A||z||(A=!0,I(J))),a},exports.unstable_shouldYield=M,exports.unstable_wrapCallback=function(a){var b=y;return function(){var c=y;y=b;try{return a.apply(this,arguments)}finally{y=c}}}})(scheduler_production_min);scheduler.exports=scheduler_production_min;var schedulerExports=scheduler.exports;export{schedulerExports as s};
//# sourceMappingURL=scheduler-Dnx1gCjA.js.map

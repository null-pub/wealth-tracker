var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});import{c as getDefaultExportFromCjs}from"./@babel-D2qBTQV_.js";function _mergeNamespaces(n2,m2){for(var i=0;i<m2.length;i++){const e=m2[i];if(typeof e!="string"&&!Array.isArray(e)){for(const k2 in e)if(k2!=="default"&&!(k2 in n2)){const d=Object.getOwnPropertyDescriptor(e,k2);d&&Object.defineProperty(n2,k2,d.get?d:{enumerable:!0,get:()=>e[k2]})}}}return Object.freeze(Object.defineProperty(n2,Symbol.toStringTag,{value:"Module"}))}__name(_mergeNamespaces,"_mergeNamespaces");var jsxRuntime={exports:{}},reactJsxRuntime_production_min={},react={exports:{}},react_production_min={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var l$1=Symbol.for("react.element"),n$1=Symbol.for("react.portal"),p$1=Symbol.for("react.fragment"),q$1=Symbol.for("react.strict_mode"),r=Symbol.for("react.profiler"),t=Symbol.for("react.provider"),u=Symbol.for("react.context"),v=Symbol.for("react.forward_ref"),w=Symbol.for("react.suspense"),x=Symbol.for("react.memo"),y=Symbol.for("react.lazy"),z=Symbol.iterator;function A(a){return a===null||typeof a!="object"?null:(a=z&&a[z]||a["@@iterator"],typeof a=="function"?a:null)}__name(A,"A");var B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},C=Object.assign,D={};function E(a,b,e){this.props=a,this.context=b,this.refs=D,this.updater=e||B}__name(E,"E");E.prototype.isReactComponent={};E.prototype.setState=function(a,b){if(typeof a!="object"&&typeof a!="function"&&a!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,a,b,"setState")};E.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};function F(){}__name(F,"F");F.prototype=E.prototype;function G(a,b,e){this.props=a,this.context=b,this.refs=D,this.updater=e||B}__name(G,"G");var H=G.prototype=new F;H.constructor=G;C(H,E.prototype);H.isPureReactComponent=!0;var I=Array.isArray,J=Object.prototype.hasOwnProperty,K={current:null},L={key:!0,ref:!0,__self:!0,__source:!0};function M(a,b,e){var d,c={},k2=null,h=null;if(b!=null)for(d in b.ref!==void 0&&(h=b.ref),b.key!==void 0&&(k2=""+b.key),b)J.call(b,d)&&!L.hasOwnProperty(d)&&(c[d]=b[d]);var g=arguments.length-2;if(g===1)c.children=e;else if(1<g){for(var f2=Array(g),m2=0;m2<g;m2++)f2[m2]=arguments[m2+2];c.children=f2}if(a&&a.defaultProps)for(d in g=a.defaultProps,g)c[d]===void 0&&(c[d]=g[d]);return{$$typeof:l$1,type:a,key:k2,ref:h,props:c,_owner:K.current}}__name(M,"M");function N(a,b){return{$$typeof:l$1,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}__name(N,"N");function O(a){return typeof a=="object"&&a!==null&&a.$$typeof===l$1}__name(O,"O");function escape(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a2){return b[a2]})}__name(escape,"escape");var P=/\/+/g;function Q(a,b){return typeof a=="object"&&a!==null&&a.key!=null?escape(""+a.key):b.toString(36)}__name(Q,"Q");function R(a,b,e,d,c){var k2=typeof a;(k2==="undefined"||k2==="boolean")&&(a=null);var h=!1;if(a===null)h=!0;else switch(k2){case"string":case"number":h=!0;break;case"object":switch(a.$$typeof){case l$1:case n$1:h=!0}}if(h)return h=a,c=c(h),a=d===""?"."+Q(h,0):d,I(c)?(e="",a!=null&&(e=a.replace(P,"$&/")+"/"),R(c,b,e,"",function(a2){return a2})):c!=null&&(O(c)&&(c=N(c,e+(!c.key||h&&h.key===c.key?"":(""+c.key).replace(P,"$&/")+"/")+a)),b.push(c)),1;if(h=0,d=d===""?".":d+":",I(a))for(var g=0;g<a.length;g++){k2=a[g];var f2=d+Q(k2,g);h+=R(k2,b,e,f2,c)}else if(f2=A(a),typeof f2=="function")for(a=f2.call(a),g=0;!(k2=a.next()).done;)k2=k2.value,f2=d+Q(k2,g++),h+=R(k2,b,e,f2,c);else if(k2==="object")throw b=String(a),Error("Objects are not valid as a React child (found: "+(b==="[object Object]"?"object with keys {"+Object.keys(a).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return h}__name(R,"R");function S(a,b,e){if(a==null)return a;var d=[],c=0;return R(a,d,"","",function(a2){return b.call(e,a2,c++)}),d}__name(S,"S");function T(a){if(a._status===-1){var b=a._result;b=b(),b.then(function(b2){(a._status===0||a._status===-1)&&(a._status=1,a._result=b2)},function(b2){(a._status===0||a._status===-1)&&(a._status=2,a._result=b2)}),a._status===-1&&(a._status=0,a._result=b)}if(a._status===1)return a._result.default;throw a._result}__name(T,"T");var U={current:null},V={transition:null},W={ReactCurrentDispatcher:U,ReactCurrentBatchConfig:V,ReactCurrentOwner:K};react_production_min.Children={map:S,forEach:function(a,b,e){S(a,function(){b.apply(this,arguments)},e)},count:function(a){var b=0;return S(a,function(){b++}),b},toArray:function(a){return S(a,function(a2){return a2})||[]},only:function(a){if(!O(a))throw Error("React.Children.only expected to receive a single React element child.");return a}};react_production_min.Component=E;react_production_min.Fragment=p$1;react_production_min.Profiler=r;react_production_min.PureComponent=G;react_production_min.StrictMode=q$1;react_production_min.Suspense=w;react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=W;react_production_min.cloneElement=function(a,b,e){if(a==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+a+".");var d=C({},a.props),c=a.key,k2=a.ref,h=a._owner;if(b!=null){if(b.ref!==void 0&&(k2=b.ref,h=K.current),b.key!==void 0&&(c=""+b.key),a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f2 in b)J.call(b,f2)&&!L.hasOwnProperty(f2)&&(d[f2]=b[f2]===void 0&&g!==void 0?g[f2]:b[f2])}var f2=arguments.length-2;if(f2===1)d.children=e;else if(1<f2){g=Array(f2);for(var m2=0;m2<f2;m2++)g[m2]=arguments[m2+2];d.children=g}return{$$typeof:l$1,type:a.type,key:c,ref:k2,props:d,_owner:h}};react_production_min.createContext=function(a){return a={$$typeof:u,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},a.Provider={$$typeof:t,_context:a},a.Consumer=a};react_production_min.createElement=M;react_production_min.createFactory=function(a){var b=M.bind(null,a);return b.type=a,b};react_production_min.createRef=function(){return{current:null}};react_production_min.forwardRef=function(a){return{$$typeof:v,render:a}};react_production_min.isValidElement=O;react_production_min.lazy=function(a){return{$$typeof:y,_payload:{_status:-1,_result:a},_init:T}};react_production_min.memo=function(a,b){return{$$typeof:x,type:a,compare:b===void 0?null:b}};react_production_min.startTransition=function(a){var b=V.transition;V.transition={};try{a()}finally{V.transition=b}};react_production_min.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.")};react_production_min.useCallback=function(a,b){return U.current.useCallback(a,b)};react_production_min.useContext=function(a){return U.current.useContext(a)};react_production_min.useDebugValue=function(){};react_production_min.useDeferredValue=function(a){return U.current.useDeferredValue(a)};react_production_min.useEffect=function(a,b){return U.current.useEffect(a,b)};react_production_min.useId=function(){return U.current.useId()};react_production_min.useImperativeHandle=function(a,b,e){return U.current.useImperativeHandle(a,b,e)};react_production_min.useInsertionEffect=function(a,b){return U.current.useInsertionEffect(a,b)};react_production_min.useLayoutEffect=function(a,b){return U.current.useLayoutEffect(a,b)};react_production_min.useMemo=function(a,b){return U.current.useMemo(a,b)};react_production_min.useReducer=function(a,b,e){return U.current.useReducer(a,b,e)};react_production_min.useRef=function(a){return U.current.useRef(a)};react_production_min.useState=function(a){return U.current.useState(a)};react_production_min.useSyncExternalStore=function(a,b,e){return U.current.useSyncExternalStore(a,b,e)};react_production_min.useTransition=function(){return U.current.useTransition()};react_production_min.version="18.2.0";react.exports=react_production_min;var reactExports=react.exports;const React=getDefaultExportFromCjs(reactExports),React$1=_mergeNamespaces({__proto__:null,default:React},[reactExports]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f=reactExports,k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;g!==void 0&&(e=""+g),a.key!==void 0&&(e=""+a.key),a.ref!==void 0&&(h=a.ref);for(b in a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)d[b]===void 0&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}__name(q,"q");reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;jsxRuntime.exports=reactJsxRuntime_production_min;var jsxRuntimeExports=jsxRuntime.exports;export{React$1 as R,React as a,jsxRuntimeExports as j,reactExports as r};
//# sourceMappingURL=react-B1yKWjgZ.js.map
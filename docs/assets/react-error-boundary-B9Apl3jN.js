var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});import{r as reactExports}from"./react-B1yKWjgZ.js";const ErrorBoundaryContext=reactExports.createContext(null),initialState={didCatch:!1,error:null},_ErrorBoundary=class _ErrorBoundary extends reactExports.Component{constructor(props){super(props),this.resetErrorBoundary=this.resetErrorBoundary.bind(this),this.state=initialState}static getDerivedStateFromError(error){return{didCatch:!0,error}}resetErrorBoundary(){const{error}=this.state;if(error!==null){for(var _this$props$onReset,_this$props,_len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++)args[_key]=arguments[_key];(_this$props$onReset=(_this$props=this.props).onReset)===null||_this$props$onReset===void 0||_this$props$onReset.call(_this$props,{args,reason:"imperative-api"}),this.setState(initialState)}}componentDidCatch(error,info){var _this$props$onError,_this$props2;(_this$props$onError=(_this$props2=this.props).onError)===null||_this$props$onError===void 0||_this$props$onError.call(_this$props2,error,info)}componentDidUpdate(prevProps,prevState){const{didCatch}=this.state,{resetKeys}=this.props;if(didCatch&&prevState.error!==null&&hasArrayChanged(prevProps.resetKeys,resetKeys)){var _this$props$onReset2,_this$props3;(_this$props$onReset2=(_this$props3=this.props).onReset)===null||_this$props$onReset2===void 0||_this$props$onReset2.call(_this$props3,{next:resetKeys,prev:prevProps.resetKeys,reason:"keys"}),this.setState(initialState)}}render(){const{children,fallbackRender,FallbackComponent,fallback}=this.props,{didCatch,error}=this.state;let childToRender=children;if(didCatch){const props={error,resetErrorBoundary:this.resetErrorBoundary};if(typeof fallbackRender=="function")childToRender=fallbackRender(props);else if(FallbackComponent)childToRender=reactExports.createElement(FallbackComponent,props);else if(fallback===null||reactExports.isValidElement(fallback))childToRender=fallback;else throw error}return reactExports.createElement(ErrorBoundaryContext.Provider,{value:{didCatch,error,resetErrorBoundary:this.resetErrorBoundary}},childToRender)}};__name(_ErrorBoundary,"ErrorBoundary");let ErrorBoundary=_ErrorBoundary;function hasArrayChanged(){let a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];return a.length!==b.length||a.some((item,index)=>!Object.is(item,b[index]))}__name(hasArrayChanged,"hasArrayChanged");export{ErrorBoundary as E};
//# sourceMappingURL=react-error-boundary-B9Apl3jN.js.map
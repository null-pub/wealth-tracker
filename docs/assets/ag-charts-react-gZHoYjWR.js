var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});import{p as propTypesExports}from"./prop-types-CkJzlR31.js";import{r as reactExports}from"./react-B1yKWjgZ.js";import{A as AgCharts}from"./ag-charts-community-aopepUF9.js";var __defProp2=Object.defineProperty,__defProps=Object.defineProperties,__getOwnPropDescs=Object.getOwnPropertyDescriptors,__getOwnPropSymbols=Object.getOwnPropertySymbols,__hasOwnProp=Object.prototype.hasOwnProperty,__propIsEnum=Object.prototype.propertyIsEnumerable,__defNormalProp=__name((obj,key,value)=>key in obj?__defProp2(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value,"__defNormalProp"),__spreadValues=__name((a,b)=>{for(var prop in b||(b={}))__hasOwnProp.call(b,prop)&&__defNormalProp(a,prop,b[prop]);if(__getOwnPropSymbols)for(var prop of __getOwnPropSymbols(b))__propIsEnum.call(b,prop)&&__defNormalProp(a,prop,b[prop]);return a},"__spreadValues"),__spreadProps=__name((a,b)=>__defProps(a,__getOwnPropDescs(b)),"__spreadProps"),_a,AgChartsReact=(_a=class extends reactExports.Component{constructor(props){super(props),this.props=props,this.chartRef=reactExports.createRef()}render(){return reactExports.createElement("div",{style:this.createStyleForDiv(),ref:this.chartRef})}createStyleForDiv(){return __spreadValues({height:"100%"},this.props.containerStyle)}componentDidMount(){const options=this.applyContainerIfNotSet(this.props.options),chart=AgCharts.create(options);this.chart=chart,chart.chart.waitForUpdate().then(()=>{var _a2,_b;return(_b=(_a2=this.props).onChartReady)==null?void 0:_b.call(_a2,chart)})}applyContainerIfNotSet(propsOptions){return propsOptions.container?propsOptions:__spreadProps(__spreadValues({},propsOptions),{container:this.chartRef.current})}shouldComponentUpdate(nextProps){return this.processPropsChanges(this.props,nextProps),!1}processPropsChanges(prevProps,nextProps){this.chart&&AgCharts.update(this.chart,this.applyContainerIfNotSet(nextProps.options))}componentWillUnmount(){this.chart&&(this.chart.destroy(),this.chart=void 0)}},__name(_a,"AgChartsReact"),_a);AgChartsReact.propTypes={options:propTypesExports.object};export{AgChartsReact as A};
//# sourceMappingURL=ag-charts-react-gZHoYjWR.js.map
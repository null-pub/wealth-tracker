var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});function numericSort(x){return x.slice().sort(function(a,b){return a-b})}__name(numericSort,"numericSort");function sumSimple(x){for(var value=0,i=0;i<x.length;i++){if(typeof x[i]!="number")return NaN;value+=x[i]}return value}__name(sumSimple,"sumSimple");function quantileSorted(x,p){var idx=x.length*p;if(x.length===0)throw new Error("quantile requires at least one data point.");if(p<0||p>1)throw new Error("quantiles must be between 0 and 1");return p===1?x[x.length-1]:p===0?x[0]:idx%1!==0?x[Math.ceil(idx)-1]:x.length%2===0?(x[idx-1]+x[idx])/2:x[idx]}__name(quantileSorted,"quantileSorted");function quickselect(arr,k,left,right){for(left=left||0,right=right||arr.length-1;right>left;){if(right-left>600){var n=right-left+1,m=k-left+1,z=Math.log(n),s=.5*Math.exp(2*z/3),sd=.5*Math.sqrt(z*s*(n-s)/n);m-n/2<0&&(sd*=-1);var newLeft=Math.max(left,Math.floor(k-m*s/n+sd)),newRight=Math.min(right,Math.floor(k+(n-m)*s/n+sd));quickselect(arr,k,newLeft,newRight)}var t=arr[k],i=left,j=right;for(swap(arr,left,k),arr[right]>t&&swap(arr,left,right);i<j;){for(swap(arr,i,j),i++,j--;arr[i]<t;)i++;for(;arr[j]>t;)j--}arr[left]===t?swap(arr,left,j):(j++,swap(arr,j,right)),j<=k&&(left=j+1),k<=j&&(right=j-1)}}__name(quickselect,"quickselect");function swap(arr,i,j){var tmp=arr[i];arr[i]=arr[j],arr[j]=tmp}__name(swap,"swap");function quantile(x,p){var copy=x.slice();if(Array.isArray(p)){multiQuantileSelect(copy,p);for(var results=[],i=0;i<p.length;i++)results[i]=quantileSorted(copy,p[i]);return results}else{var idx=quantileIndex(copy.length,p);return quantileSelect(copy,idx,0,copy.length-1),quantileSorted(copy,p)}}__name(quantile,"quantile");function quantileSelect(arr,k,left,right){k%1===0?quickselect(arr,k,left,right):(k=Math.floor(k),quickselect(arr,k,left,right),quickselect(arr,k+1,k+1,right))}__name(quantileSelect,"quantileSelect");function multiQuantileSelect(arr,p){for(var indices=[0],i=0;i<p.length;i++)indices.push(quantileIndex(arr.length,p[i]));indices.push(arr.length-1),indices.sort(compare);for(var stack=[0,indices.length-1];stack.length;){var r=Math.ceil(stack.pop()),l=Math.floor(stack.pop());if(!(r-l<=1)){var m=Math.floor((l+r)/2);quantileSelect(arr,indices[m],Math.floor(indices[l]),Math.ceil(indices[r])),stack.push(l,m,m,r)}}}__name(multiQuantileSelect,"multiQuantileSelect");function compare(a,b){return a-b}__name(compare,"compare");function quantileIndex(len,p){var idx=len*p;return p===1?len-1:p===0?0:idx%1!==0?Math.ceil(idx)-1:len%2===0?idx-.5:idx}__name(quantileIndex,"quantileIndex");function median(x){return+quantile(x,.5)}__name(median,"median");function makeMatrix(columns,rows){for(var matrix=[],i=0;i<columns;i++){for(var column=[],j=0;j<rows;j++)column.push(0);matrix.push(column)}return matrix}__name(makeMatrix,"makeMatrix");function uniqueCountSorted(x){for(var uniqueValueCount=0,lastSeenValue,i=0;i<x.length;i++)(i===0||x[i]!==lastSeenValue)&&(lastSeenValue=x[i],uniqueValueCount++);return uniqueValueCount}__name(uniqueCountSorted,"uniqueCountSorted");function ssq(j,i,sums,sumsOfSquares){var sji;if(j>0){var muji=(sums[i]-sums[j-1])/(i-j+1);sji=sumsOfSquares[i]-sumsOfSquares[j-1]-(i-j+1)*muji*muji}else sji=sumsOfSquares[i]-sums[i]*sums[i]/(i+1);return sji<0?0:sji}__name(ssq,"ssq");function fillMatrixColumn(iMin,iMax,cluster,matrix,backtrackMatrix,sums,sumsOfSquares){if(!(iMin>iMax)){var i=Math.floor((iMin+iMax)/2);matrix[cluster][i]=matrix[cluster-1][i-1],backtrackMatrix[cluster][i]=i;var jlow=cluster;iMin>cluster&&(jlow=Math.max(jlow,backtrackMatrix[cluster][iMin-1]||0)),jlow=Math.max(jlow,backtrackMatrix[cluster-1][i]||0);var jhigh=i-1;iMax<matrix[0].length-1&&(jhigh=Math.min(jhigh,backtrackMatrix[cluster][iMax+1]||0));for(var sji,sjlowi,ssqjlow,ssqj,j=jhigh;j>=jlow&&(sji=ssq(j,i,sums,sumsOfSquares),!(sji+matrix[cluster-1][jlow-1]>=matrix[cluster][i]));--j)sjlowi=ssq(jlow,i,sums,sumsOfSquares),ssqjlow=sjlowi+matrix[cluster-1][jlow-1],ssqjlow<matrix[cluster][i]&&(matrix[cluster][i]=ssqjlow,backtrackMatrix[cluster][i]=jlow),jlow++,ssqj=sji+matrix[cluster-1][j-1],ssqj<matrix[cluster][i]&&(matrix[cluster][i]=ssqj,backtrackMatrix[cluster][i]=j);fillMatrixColumn(iMin,i-1,cluster,matrix,backtrackMatrix,sums,sumsOfSquares),fillMatrixColumn(i+1,iMax,cluster,matrix,backtrackMatrix,sums,sumsOfSquares)}}__name(fillMatrixColumn,"fillMatrixColumn");function fillMatrices(data,matrix,backtrackMatrix){for(var nValues=matrix[0].length,shift=data[Math.floor(nValues/2)],sums=[],sumsOfSquares=[],i=0,shiftedValue=void 0;i<nValues;++i)shiftedValue=data[i]-shift,i===0?(sums.push(shiftedValue),sumsOfSquares.push(shiftedValue*shiftedValue)):(sums.push(sums[i-1]+shiftedValue),sumsOfSquares.push(sumsOfSquares[i-1]+shiftedValue*shiftedValue)),matrix[0][i]=ssq(0,i,sums,sumsOfSquares),backtrackMatrix[0][i]=0;for(var iMin,cluster=1;cluster<matrix.length;++cluster)cluster<matrix.length-1?iMin=cluster:iMin=nValues-1,fillMatrixColumn(iMin,nValues-1,cluster,matrix,backtrackMatrix,sums,sumsOfSquares)}__name(fillMatrices,"fillMatrices");function ckmeans(x,nClusters){if(nClusters>x.length)throw new Error("cannot generate more classes than there are data values");var sorted=numericSort(x),uniqueCount=uniqueCountSorted(sorted);if(uniqueCount===1)return[sorted];var matrix=makeMatrix(nClusters,sorted.length),backtrackMatrix=makeMatrix(nClusters,sorted.length);fillMatrices(sorted,matrix,backtrackMatrix);for(var clusters=[],clusterRight=backtrackMatrix[0].length-1,cluster=backtrackMatrix.length-1;cluster>=0;cluster--){var clusterLeft=backtrackMatrix[cluster][clusterRight];clusters[cluster]=sorted.slice(clusterLeft,clusterRight+1),cluster>0&&(clusterRight=clusterLeft-1)}return clusters}__name(ckmeans,"ckmeans");export{ckmeans as c,median as m,sumSimple as s};
//# sourceMappingURL=simple-statistics-CZf34g31.js.map

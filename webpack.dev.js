 import { merge } from 'webpack-merge';
 import common from './webpack.config.js';

 export default merge(common, {
   mode: 'development',
   devtool: "eval-source-map",
   devServer: {
    static: './dist',
    watchFiles: ["./src/index.html"],
   },
   devServer: {
     static: './dist',
   },
 });
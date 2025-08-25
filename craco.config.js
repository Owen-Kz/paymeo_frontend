// // craco.config.js
// const path = require('path');

// module.exports = {
//   webpack: {
//     configure: (webpackConfig) => {
//       webpackConfig.resolve = {
//         ...webpackConfig.resolve,
//         alias: {
//           ...webpackConfig.resolve.alias,
//           '@assets': path.resolve(__dirname, 'public/assets'),
//         }
//       };
//       return webpackConfig;
//     }
//   }
// };
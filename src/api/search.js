import elasticsearchClient from './elasticsearchConnection.js';

/**
 * ElasticSearch Cat API
 * @type {{getIndexInfoList: module.exports.getIndexInfoList, getIndexList: module.exports.getIndexList}}
 */

module.exports = {
  search : function (reqParam) {
    return new Promise(function (resolve, reject) {
      elasticsearchClient.search(reqParam, function (err,resp,status) {
        if(status == '200') {
          resolve(resp);
        }else{
          reject(err);
        }
      })
    }).then(function (resp) {
      return resp;
    });
  }
};


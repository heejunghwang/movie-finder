import elasticsearchClient from './elasticsearchConnection.js';

/**
 * ElasticSearch Cat API
 * @type {{getIndexInfoList: module.exports.getIndexInfoList, getIndexList: module.exports.getIndexList}}
 */

module.exports = {
  getIndexInfoList : function () {
      return new Promise(function (resolve, reject) {
        elasticsearchClient.cat.indices({format:'json'}, function (err,resp,status) {
          if(status == '200') {
            resolve(resp);
          }else{
            reject(err);
          }
        })
      }).then(function (resp) {
        return resp;
      });
  },
  getIndexList : function () {
    return this.getIndexInfoList().then(function(result) {
      let indexList = new Array();
      for (let [k, v] of Object.entries(result)) {
        indexList.push(v.index)
      }
      return indexList;
    });
  }
};


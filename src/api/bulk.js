/**
 * Created by hwang on 2018. 2. 4..
 */
import elasticsearchClient from './elasticsearchConnection.js';

const each = require('foreach');

export default {
  bulkIndex : function (indexName, typeName, bulkDocument) {
    let reqParam = new Array();
    let bulkFormat = {
      index : {
        _index : indexName,
        _type : typeName
      }
    };
    bulkFormat = JSON.stringify(bulkFormat)
    each(bulkDocument, function (value, key, array) {
        reqParam.push(bulkFormat)
        reqParam.push(value)
    });
    return this.startBulkInsert(reqParam).then(function (result) {
      if(result.errors == false){
        console.log("finish to import data")
      }else{
        console.log("fail to import data")
        console.log(result)
      }
    });
  },
  startBulkInsert : function (reqParam) {
    return new Promise(function (resolve, reject) {
      elasticsearchClient.bulk({
        body: reqParam
      },function(err,resp,status) {
        if(status == '200') {
          resolve(resp);
        }else{
          reject(err);
        }
      });
    }).then(function (resp) {
      return resp;
    });
  }
};


/**
 * Created by hwang on 2018. 2. 4..
 */
import elasticsearchClient from './elasticsearchConnection.js';

const each = require('foreach');

/**
 * Elasticsearch bulk API
 */

export default {
  /**
   * bulk 인덱싱을 한다.
   * @param indexName
   * @param typeName
   * @param bulkDocument
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
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
    return this.startBulkIndex(reqParam).then(function (result) {
      if(result.errors == false){
        return true;
      }else{
        alert("fail to import data")
        console.log(result)
        return false;
      }
    });
  },

  /**
   * bulk 인덱싱 엘라스틱 서치 API 호출을 한다.
   * @param reqParam
   * @returns {Promise<any>}
   */
  startBulkIndex : function (reqParam) {
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


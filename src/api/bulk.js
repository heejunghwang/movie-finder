/**
 * Created by hwang on 2018. 2. 4..
 */
import elasticsearchClient from './elasticsearchConnection.js';
import $ from 'jQuery'

const each = require('foreach');

module.exports = {
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
      //TODO : 10000건씩 잘라서 넣도록
      //TODO : 지금 60000건이 안들어감
        reqParam.push(bulkFormat)
        reqParam.push(value)
    });

    return new Promise(function (resolve, reject) {
      elasticsearchClient.bulk({
        body: reqParam
      },function(err,resp,status) {
        if(err) {
          reject(err);
        }
        else {
          resolve(resp);
        }
      });
    }).then(function (resp) {
      return resp;
    });
  }
};


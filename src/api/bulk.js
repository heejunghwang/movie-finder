/**
 * Created by hwang on 2018. 2. 4..
 */
import elasticsearchClient from './elasticsearchConnection.js';
import $ from 'jQuery'

module.exports = {
  bulkIndex : function (indexName, typeName, bulkDocument) {
    var result = new Array();
    var bulkFormat ='{ index:  { _index: indexName, _type: typeName } }';
    var doc1 = "{ 'title': 'foo' }";
    var doc2 = "{ 'title': 'bar' }";

    //TODO : 이런식으로 만들어주자
    console.log(JSON.stringify(bulkFormat.concat(",").concat(doc1).concat(",").concat(bulkFormat).concat(",").concat(doc2)))

/*
    return new Promise(function (resolve, reject) {
      elasticsearchClient.bulk({
        body: [
          { index:  { _index: indexName, _type: typeName } }, { title: 'foo' },
          { index:  { _index: indexName, _type: typeName } }, { title: 'bar' },
        ]
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
    */
  }
};


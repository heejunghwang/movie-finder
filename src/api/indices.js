import elasticsearchClient from './elasticsearchConnection.js';

module.exports = {
  createIndex : function (indexName, reqBody) {
    return new Promise(function (resolve, reject) {
      elasticsearchClient.indices.create({
        index: indexName,
        body:reqBody
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
  },

  deleteIndex : function (indexName) {
    return new Promise(function (resolve, reject) {
      elasticsearchClient.indices.delete({
        index: indexName
      }, function (err, resp, status) {
        if (err) {
          reject(err);
        }
        else {
          resolve(resp);
        }
      });
    }).then(function (resp) {
      return resp;
    });
  },

  getMapping : function (indexName) {

    // return new Promise(function (resolve, reject) {
    //   elasticsearchClient.indices.getFieldMapping({
    //     index: indexName
    //   }, function (err, resp, status) {
    //     if (err) {
    //       reject(err);
    //     }
    //     else {
    //       console.log(resp)
    //       resolve(resp);
    //     }
    //   });
    // }).then(function (resp) {
    //   return resp;
    // });
  }
};


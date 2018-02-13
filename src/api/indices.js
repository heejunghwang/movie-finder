import elasticsearchClient from './elasticsearchConnection.js';

export default {
  createIndex : function (indexName, reqBody) {
    return new Promise(function (resolve, reject) {
      elasticsearchClient.indices.create({
        index: indexName,
        body:reqBody
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
  },

  deleteIndex : function (indexName) {
    return new Promise(function (resolve, reject) {
      elasticsearchClient.indices.delete({
        index: indexName
      }, function (err, resp, status) {
        if(status == '200') {
          resolve(resp);
        }else{
          reject(err);
        }
      });
    }).then(function (resp) {
      return resp;
    });
  },

  getMapping : function (indexName) {
    return new Promise(function (resolve, reject) {
      elasticsearchClient.indices.getMapping({
        index: indexName,
        expandWildcards : "all"
      }, function (err, resp, status) {
        if(status == '200') {
          resolve(resp);
        }else{
          reject(err);
        }
      });
    }).then(function (resp) {
      return resp;
    });
  },

  putMapping : function (indexName, typeName, reqBody) {
    return new Promise(function (resolve, reject) {
      elasticsearchClient.indices.putMapping({
        index: indexName,
        type: typeName,
        body: {
          properties : reqBody
        }
      }, function (err, resp, status) {
        if(status == '200') {
          resolve(resp);
        }else{
          reject(err);
        }
      });
    }).then(function (resp) {
      return resp;
    });
  },

  analyze : function (indexName, analyzer, text) {
    return new Promise(function (resolve, reject) {
      elasticsearchClient.indices.analyze({
        index: indexName,
        body : {
          analyzer : analyzer,
          text : text
        }
      }, function (err, resp, status) {
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


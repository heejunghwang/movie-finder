import elasticsearchClient from './elasticsearchConnection.js';
/**
 * 엘라스틱서치 index API
 */

export default {
  /**
   * 인덱스를 생성을 한다.
   * @param indexName
   * @param reqBody
   * @returns {Promise<any>}
   */
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

  /**
   * 인덱스 삭제를 한다.
   * @param indexName
   * @returns {Promise<any>}
   */
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

  /**
   * 인덱스 매핑 정보 조회를 한다.
   * @param indexName
   * @returns {Promise<any>}
   */
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

  /**
   * 인덱스 필드 매핑 설정을 한다.
   * @param indexName
   * @param typeName
   * @param reqBody
   * @returns {Promise<any>}
   */
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

  /**
   * 인덱스에 설정된 분석기로 텍스트 분석을 한다.
   * @param indexName
   * @param analyzer
   * @param text
   * @returns {Promise<any>}
   */
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


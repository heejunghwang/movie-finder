import elasticsearchClient from './elasticsearchConnection.js';

/**
 * ElasticSearch Cat API
 */

export default {
  /**
   * 인덱스 정보를 조회를 한다.
   * @returns {Promise<any>}
   */
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

  /**
   * 인덱스 이름, 카운트 조회를 한다.
   * @returns {Promise<T>}
   */
  getIndexList : function () {
    return this.getIndexInfoList().then(function(result) {
      let indexList = new Array();
      for (let [k, v] of Object.entries(result)) {
        let value = JSON.parse(JSON.stringify(v).split(".").join("_"));
        let item = {
          index : value.index,
          docs_count : value.docs_count
        }
        indexList.push(item)
      }
      return indexList;
    });
  }

};


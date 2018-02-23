import elasticsearchClient from './elasticsearchConnection.js';

/**
 * ElasticSearch Cat API
 */

export default {
  /**
   * 인덱스 정보를 조회를 한다.
   * @returns {Promise<any>}
   */
  getIndexInfoList () {
      return new Promise((resolve, reject) => {
        elasticsearchClient.cat.indices({format:'json'}, (err,resp,status) => {
          if(status == '200') {
            resolve(resp);
          }else{
            reject(err);
          }
        })
      }).then((resp) => {
        return resp;
      });
  },

  /**
   * 인덱스 이름, 카운트 조회를 한다.
   * @returns {Promise<T>}
   */
  getIndexList () {
    return this.getIndexInfoList().then((result) => {
      let indexList = new Array();
      for (let [k, v] of Object.entries(result)) {
        let value = JSON.parse(JSON.stringify(v).replace(/\./g, '_'));
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


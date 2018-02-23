import elasticsearchClient from './elasticsearchConnection.js';

export default {
  /**
   * 엘라스틱서치 클러스터 health 상태를 조회를 한다.
   * @returns {Promise<any>}
   */
  getClusterHealth () {
    return new Promise((resolve, reject) => {
      elasticsearchClient.cluster.health({}, (err,resp,status) => {
        if(status == '200') {
          resolve(resp);
        }else{
          reject(err);
        }
      })
    }).then((resp) => {
      return resp;
    });
  }

};

<template>
  <div class="container">
    인덱스 생성
    매핑
    색인 시작
    색인 삭제

    <div class="card border-secondary mb-3" style="max-width: 18rem;">
      <div class="card-header">Connection</div>
      <div class="card-body text-secondary">
        <h5 class="card-title">{{ clientHealth.cluster_name }}</h5>
        <p class="card-text">status : {{clientHealth.status}}</p>
        <p class="card-text">number_of_nodes : {{clientHealth.number_of_nodes}}</p>
        <p class="card-text">number_of_data_nodes : {{clientHealth.number_of_data_nodes}}</p>
      </div>
    </div>

  </div>

</template>

<script>

  import ElasticsearchConfig from '../../config/elasticsearch.env.js'

  /**
   * 엘라스틱 서치 연결을 위한 모듈
   * @type {es}
   */

  const elasticsearch = require('elasticsearch');

  const elasticsearchClient = new elasticsearch.Client({
    host: ElasticsearchConfig.elasticsearch_host,
    cors : true,
    keepAlive : false,
    log: 'trace'
  });


  export default {
    name: 'ManageElasticSearch',
    created() {
      this.getElasticsearchHealth()
    },
    data () {
      return {
        clientHealth: ''  //상태값
      }
    },
    methods : {
      /**
       * 3초에 한번씩 연결 상태 확인
       */
      getElasticsearchHealth : function () {
        let self = this;
        // setInterval(function() {
          elasticsearchClient.cluster.health({},function(err,resp,status) {
            // console.log(err)
            // console.log(resp)
            console.log("여기여기!!!")
            console.log(status)


            if(typeof status === 'undefined') {
              self.clientHealth = 'CONNECTION_REFUSED'
           }else{
              self.clientHealth = resp;
            }
          });
        // }, 3000);
      }
    }
  }
</script>

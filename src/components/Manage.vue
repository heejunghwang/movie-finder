<template>
  <div>
    <Menu></Menu>
    <br>
    <!-- container-->
    <div class="container">
      <div class="card border-secondary mb-3" style="max-width: 18rem;">
        <div class="card-header">Connection</div>
        <div class="card-body text-secondary">
          <div v-if="clientHealth !== null">
            <h5 class="card-title">{{ clientHealth.cluster_name }}</h5>
            <p class="card-text">status : {{ clientHealth.status }}</p>
            <p class="card-text">number_of_nodes : {{ clientHealth.number_of_nodes }}</p>
            <p class="card-text">number_of_data_nodes : {{ clientHealth.number_of_data_nodes }}</p>
          </div>
        </div>
        <div v-if="clientHealth == null">
          CONNECTION_REFUSED
        </div>
      </div>

      <div class="card border-secondary mb-3" style="max-width: 18rem;">
        <div class="card-header">인덱스 관리</div>
        <div class="card-body text-secondary">
          <div v-for="item in indexList">
            <span>{{item}}</span>
          </div>
          <router-link to="./create-index" class="btn btn-secondary">관리</router-link>
        </div>
      </div>

      <div class="card border-secondary mb-3" style="max-width: 18rem;">
        <div class="card-header">데이터 추가</div>
        <div class="card-body text-secondary">
          <router-link to="./create-index" class="btn btn-secondary">+</router-link>
        </div>
      </div>

    </div>
    <!--// end of container-->
  </div>

</template>

<script>

  import elasticsearchClient from '../api/elasticsearchConnection.js';
  import es_cat from '../api/cat.js';

  export default {
    name: 'Manage',
    created() {
      this.getElasticsearchHealth()
      this.getIndexList()
    },
    data () {
      return {
        clientHealth: '',  //상태값
        indexList : ''
      }
    },
    methods : {
      /**
       * 연결 상태 확인
       */
      getElasticsearchHealth : function () {
        let self = this;
          setInterval(function() {
              elasticsearchClient.cluster.health({},function(err,resp,status) {
                if(status == '200') {
                  self.clientHealth = resp;
                }else{
                  self.clientHealth = null;
                }
              });
          }, 3000);
      },
      /**
       * 전체 인덱스 리스트 조회
       */
      getIndexList : function () {
        let self = this;
        es_cat.getIndexList().then(function(result){
          self.indexList = result;
        })
      },


    }
  }
</script>

<template>
  <div>
    <Menu></Menu>
    <br>
    <!-- container-->
    <div class="container">

      <div class="jumbotron jumbotron-fluid">
        <div class="container">
          <h1>Elasticsearch Health <img src="../assets/health.png" style="width:50px"></h1>
          <div v-if="clientHealth !== '' && clientHealth !== null">
            <h5 class="card-title"> <img style="width:50px" class="cluster"> cluster : {{ clientHealth.cluster_name }}</h5>
            <p class="card-text">status : {{ clientHealth.status }}</p>
            <p class="card-text">number_of_nodes : {{ clientHealth.number_of_nodes }}</p>
            <p class="card-text">number_of_data_nodes : {{ clientHealth.number_of_data_nodes }}</p>
          </div>
        </div>
        <div v-if="clientHealth == ''">
          LOADING
        </div>
        <div v-if="clientHealth == null">
          CONNECTION_REFUSED
        </div>
      </div>

      <div class="list-group">
        <li class="list-group-item list-group-item-secondary">인덱스 리스트</li>
        <div v-for="item in indexList">
          <a href="#" class="list-group-item list-group-item-action" >
          {{ item }}
          <router-link :to="'./mapping-index?indexName='+item"><img src="../assets/manage.png" style="width:15px;"></router-link>
          <a v-on:click="deleteIndex(item)"><img src="../assets/delete.png" style="width:13px"></a>
          </a>
        </div>
      </div>

      <router-link to="./create-index" class="btn btn-light" style="float:right"><img src="../assets/plus.png" style="width:15px;"> 신규생성</router-link>

    </div>
    <!--// end of container-->
  </div>
  <!--// end of main div-->


</template>

<script>

  import elasticsearchClient from '../api/elasticsearchConnection.js';
  import es_cat from '../api/cat.js';
  import es_indices from '../api/indices.js';
  import router from '../router'

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
      /**
       * 인덱스 삭제
       * @param indexName
       */
      deleteIndex : function (indexName) {
        if(confirm(indexName+"를 정말 삭제하겠습니까?")){
          es_indices.deleteIndex(indexName).then(function(result){
            if(typeof result !== 'undefined' && result !== null && result.acknowledged === true){
              window.location.reload(true);
            }
          })
        }
      },
      /**
       * 인덱스 매핑 설정
       * @param indexName
       */
      mappingIndex : function (indexName) {
        router.push({
          //name: "MappingColumn",
          path : '/mapping-index',
          query: {indexName: indexName},
        });

      }
    }
  }
</script>


<style scoped>

</style>


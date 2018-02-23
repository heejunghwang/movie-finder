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
        <li class="list-group-item list-group-item-secondary" style="font-weight: bold"><img src="../assets/list.png" style="width:20px;margin-right:5px">Index List</li>
        <div v-for="item in indexList">
          <a href="#" class="list-group-item list-group-item-action" >
            <img src="../assets/index.icon.png" style="width:40px;margin-right: 10px">
              <span style="font-weight: bold">{{ item.index }} ( {{ commaNumber(item.docs_count) }} )</span>
            <router-link :to="'./mapping-index?indexName='+item.index"><img src="../assets/manage.png" style="width:20px;"></router-link>
            <a v-on:click="deleteIndex(item.index)"><img src="../assets/delete.png" style="width:15px"></a>
          </a>
        </div>
      </div>
      <br>
      <router-link to="./create-index" class="btn btn-light" style="float:right; border-color:lightgrey"><img src="../assets/plus.png" style="width:15px;"> Create New Index</router-link>

    </div>
    <!--// end of container-->
  </div>
  <!--// end of main div-->


</template>

<script>

  import es_cluster from '../api/cluster.js';
  import es_cat from '../api/cat.js';
  import es_indices from '../api/indices.js';
  import router from '../router'
  const commaNumber = require('comma-number')

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
       * 연결 상태 확인한다.
       */
      getElasticsearchHealth : function () {
        let self = this;
          setInterval(function() {
            es_cluster.getClusterHealth().then((result) => {
              self.clientHealth = result;
            })
          }, 3000);
      },
      /**
       * 전체 인덱스 리스트 조회한다.
       */
      getIndexList : function () {
        let self = this;
        es_cat.getIndexList().then((result) => {
          self.indexList = result;
        })
      },
      /**
       * 인덱스 삭제를 한다.
       * @param indexName
       */
      deleteIndex : function (indexName) {
        if(confirm(indexName+"를 정말 삭제하겠습니까?")){
          es_indices.deleteIndex(indexName).then((result) => {
            if(typeof result !== 'undefined' && result !== null && result.acknowledged === true){
              window.location.reload(true);
            }
          })
        }
      },
      /**
       * 인덱스 매핑 설정을 한다.
       * @param indexName
       */
      mappingIndex : function (indexName) {
        router.push({
          path : '/mapping-index',
          query: {indexName: indexName},
        });

      },
      /**
       * 콤마 표시를 한다.
       * @param number
       */
      commaNumber : function (number) {
        return commaNumber(number)
      },
    }
  }
</script>


<style scoped>

</style>


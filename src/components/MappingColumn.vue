<template>
  <div class="container">

    <h1>컬럼 관리</h1>
    <div class="card border-secondary mb-3" style="max-width: 18rem;">
      <div class="card-header"> 현재 컬럼 리스트</div>
      <!--<div class="card-body text-secondary">-->
        <!--<div v-for="item in indexList">-->
          <!--<span>{{item}}</span>-->
          <!--<span v-on:click="mappingIndex(item)"><img src="../assets/manage.png" style="width:13px">-->
            <!--&lt;!&ndash;<router-link to="./create-index" class="btn btn-secondary"></router-link>&ndash;&gt;-->
          <!--</span>-->
          <!--<span v-on:click="deleteIndex(item)"><img src="../assets/delete.png" style="width:13px"></span>-->
        <!--</div>-->
      <!--</div>-->
    </div>

    <!--<form class="bs-example bs-example-form" data-example-id="input-group-with-checkbox-radio">-->
      <!--<div class="row">-->
        <!--<p>인덱스 이름</p>-->
        <!--<div class="col-lg-6">-->
          <!--<div class="input-group">-->
            <!--<input class="form-control" aria-label="Text input" v-model="indexName">-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->

      <!--<div class="row">-->
        <!--<p>Body</p>-->
        <!--<div class="col-lg-6">-->
          <!--<div class="form-group">-->
            <!--<textarea class="form-control" rows="35" cols="50" id="bodyReq">{{reqBody}}</textarea>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->

      <!--<a href="javascript:;" class="btn btn-secondary router-link-exact-active router-link-active" @click="createNewIndex">생성</a>-->
    <!--</form>-->
  </div>

</template>

<script>

  import es_cat from '../api/cat.js';
  import es_indices from '../api/indices.js';

  export default {
    name: 'MappingColumn',
    created() {
      this.getIndexMapping();
    },
    data () {
      return {
        indexName : '',
        reqBody : '',
        indexList : ''
      }
    },
    methods : {
      getIndexMapping : function () {
        const indexName  = 'test';
        es_indices.getMapping(indexName)
      }

    }
  }

  //TODO : curl -XGET 'http://localhost:9200/test/_mapping/*'
</script>

<template>
  <div>
    <Menu></Menu>

    <!-- container-->
    <div class="container">

      <h1>관리</h1>
      <div class="card border-secondary mb-3" style="max-width: 18rem;">
        <div class="card-header"> 현재 인덱스 리스트</div>
        <div class="card-body text-secondary">
          <div v-for="item in indexList">
            <span>{{item}}</span>
            <span v-on:click="mappingIndex(item)"><img src="../assets/manage.png" style="width:13px"></span>
            <span v-on:click="deleteIndex(item)"><img src="../assets/delete.png" style="width:13px"></span>

          </div>
        </div>
      </div>

      <form class="bs-example bs-example-form" data-example-id="input-group-with-checkbox-radio">
        <div class="row">
          <p>인덱스 이름</p>
          <div class="col-lg-6">
            <div class="input-group">
              <input class="form-control" aria-label="Text input" v-model="indexName">
            </div>
          </div>
        </div>

        <div class="row">
          <p>Body</p>
          <div class="col-lg-6">
            <div class="form-group">
              <textarea class="form-control" rows="35" cols="50" id="bodyReq">{{reqBody}}</textarea>
            </div>
          </div>
        </div>

        <a href="javascript:;" class="btn btn-secondary router-link-exact-active router-link-active" @click="createNewIndex">생성</a>
      </form>
    </div>
    <!-- // end of container-->
  </div>

</template>

<script>

  import es_cat from '../api/cat.js';
  import es_indices from '../api/indices.js';
  import router from '../router'

  export default {
    name: 'CreateIndex',
    created() {
      this.setDefaultValue();
      this.getIndexList()
    },
    data () {
      return {
        indexName : '',
        reqBody : '',
        indexList : ''
      }
    },
    methods : {
      setDefaultValue : function () {
        this.indexName = 'test'
        const defaultValue = {
          "settings": {
            "index" : {
              "analysis":{
                "filter" : {
                  "test_synonym" : {
                    "type": "synonym",
                    "synonyms_path": "synonym.txt",
                    "tokenizer": "seunjeon_default_tokenizer"
                  }
                },
                "analyzer": {
                  "korean": {
                    "type": "custom",
                    "tokenizer": "seunjeon_default_tokenizer",
                    "filter": ["test_synonym","lowercase", "trim"]
                  }
                },
                "tokenizer": {
                  "seunjeon_default_tokenizer": {
                    "type": "seunjeon_tokenizer",
                    "index_eojeol": false
                  }
                }
              }
            }
          }
        };
        this.reqBody = JSON.stringify(defaultValue,null,2);
      },
      getIndexList : function () {
        let self = this;
        es_cat.getIndexList().then(function(result){
          self.indexList = result;
        })
      },
      /**
       * 인덱스 생성
       */
      createNewIndex : function () {
        //TODO : validation check : if there is same name index
        const indexName = this.indexName;
        const reqBody = this.reqBody;
        es_indices.createIndex(indexName, reqBody).then(function(result){
          if(typeof result !== 'undefined' && result !== null && result.acknowledged === true){
            window.location.reload(true);
          }
        });


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
          name: "MappingColumn",
          query : {indexName : indexName}
        });
      }
    }
  }
</script>

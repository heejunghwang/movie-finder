<template>
  <div class="container">
    <!-- TODO : 메뉴넣기-->
    <h1>{{indexName}} 컬럼 관리</h1>

    <form class="bs-example bs-example-form" data-example-id="input-group-with-checkbox-radio">
      <div class="row">
        <p>Index 이름</p>
        <div class="col-lg-6">
          <div class="input-group">
            <input class="form-control" aria-label="Text input" v-model="indexName" readonly="true">
          </div>
        </div>
      </div>
      <div class="row">
        <p>Type 이름</p>
        <div class="col-lg-6">
          <div class="input-group">
            <input class="form-control" aria-label="Text input" v-model="typeName">
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

      <a href="javascript:;" class="btn btn-secondary router-link-exact-active router-link-active" @click="putFieldMapping">생성</a>
    </form>

    <div> 현재 컬럼 정보</div>
    <textarea class="form-control" rows="35" cols="50" readonly="true">{{ propertiesInfo }}</textarea>
  </div>

</template>

<script>

  import es_indices from '../api/indices.js';

  export default {
    name: 'MappingColumn',
    created() {
      this.indexName = this.$route.query.indexName;
      this.initValue();
      this.getIndexMapping();
    },
    data () {
      return {
        indexName : '',
        typeName : '',
        reqBody : '',
        propertiesInfo : ''
      }
    },
    methods : {
      initValue : function () {
        this.typeName = 'info'

        const koreanAnalyzer = {
          type: 'text',
          analyzer : 'korean',
          search_analyzer : 'korean'
        }

        const fieldArray = {
          movieNm : koreanAnalyzer,
          movieNmEn : koreanAnalyzer,
          typeNm : koreanAnalyzer,
          prdtStatNm : koreanAnalyzer,
          nationAlt : koreanAnalyzer,
          genreAlt : koreanAnalyzer,
          repNationNm : koreanAnalyzer,
          repGenreNm : koreanAnalyzer
        }

        this.reqBody = JSON.stringify(fieldArray, undefined, 2);
      },
      getIndexMapping : function () {
        const indexName  = this.indexName;
        const self = this;
        es_indices.getMapping(indexName).then(function(result){
          self.propertiesInfo = JSON.stringify(result, undefined, 2);
        })
      },
      putFieldMapping : function () {
        const indexName  = this.indexName;
        const typeName = this.typeName;
        const reqBody = JSON.parse(this.reqBody);

        es_indices.putMapping(indexName, typeName, reqBody).then(function () {
          if(typeof result !== 'undefined' && result !== null && result.acknowledged === true){
            window.location.reload(true);
          }
        })

      }
    }
  }

</script>

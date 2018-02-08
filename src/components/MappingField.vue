<template>
  <div>
    <Menu></Menu>
    <br>
    <h1>{{indexName}} Mapping Manage <img src="../assets/black2-manage.png" style="width: 60px"></h1>
    <hr>
    <div class="container-fluid">
      <div class="row">
        <div class="col-5 sidebar">
          <h2 style="float:left">Current {{indexName}} Field Info</h2>
          <textarea class="form-control" rows="35" cols="30" readonly="true">{{ propertiesInfo }}</textarea>
        </div>

        <div class="col-lg-auto">
          <h3>{{indexName}} 필드 매핑</h3>
          <form>
            <div class="form-group row">

            </div>
            <div class="form-group row">
              <label for="inputIndexName" class="col-sm-2 col-form-label">Index 이름</label>
              <div class="col-sm-10">
                <input class="form-control" aria-label="Text input" v-model="indexName" id="inputIndexName" readonly="true">
              </div>
            </div>
            <div class="form-group row">
              <label for="inputTypeName" class="col-sm-2 col-form-label">Type 이름</label>
              <div class="col-sm-10">
                <input class="form-control" aria-label="Text input" id="inputTypeName" v-model="typeName">
              </div>
            </div>
            <div class="form-group row">
              <label for="bodyReq" class="col-sm-2 col-form-label"></label>
              <div class="col-sm-10">
                <textarea class="form-control" rows="35" cols="50" id="bodyReq">{{reqBody}}</textarea>
              </div>
            </div>
            <a href="javascript:;" class="btn btn-secondary router-link-exact-active router-link-active" @click="putFieldMapping">생성</a>
          </form>
        </div>
      </div>

    </div>

  </div>

</template>

<script>

  import es_indices from '../api/indices.js';

  export default {
    name: 'MappingField',
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

        const jmoAnalyzer = {
          type: 'text',
          analyzer : 'hangul_jamo_analyzer',
          search_analyzer : 'hangul_jamo_search_analyzer'
        }

        const defaultSetting = {
          type: 'keyword',
          null_value: 'NULL',
        }

        const prdtYearForamt = {
          type : 'integer',
          null_value : '0'
        }

        const openDtForamt = {
          type : 'integer',
          null_value : '0'
        }

        const genreForamt = {
          type: 'text',
          analyzer : 'simple',
          search_analyzer : 'simple',
          fielddata : true
        }

        const fieldArray = {
          movieNm : jmoAnalyzer,
          movieNmEn : jmoAnalyzer,
          prdtYear : prdtYearForamt,
          openDt : openDtForamt,
          typeNm : defaultSetting,
          prdtStatNm : defaultSetting,
          nationAlt : defaultSetting,
          genreAlt : genreForamt,
          repNationNm : defaultSetting,
          repGenreNm : defaultSetting
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

        es_indices.putMapping(indexName, typeName, reqBody).then(function (result) {
          if(typeof result !== 'undefined' && result !== null && result.acknowledged === true){
            window.location.reload(true);
          }
        })

      }
    }
  }

</script>

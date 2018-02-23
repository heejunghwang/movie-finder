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

        <div class="col">
          <h3>{{indexName}} 필드 매핑</h3>
          <form>
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
              <label for="inputTypeName" class="col-sm-2 col-form-label">필드분석기</label>
              <div class="col-sm-10">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" id="inlineRadio1" value="sEunjeon" v-model="fieldAnalyzer" @click="setSEunjeonFeilds">
                  <label class="form-check-label" for="inlineRadio1">은전한닢s</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" id="inlineRadio2" value="jamo" v-model="fieldAnalyzer" @click="setJamoFields">
                  <label class="form-check-label" for="inlineRadio2">자모분석기</label>
                </div>
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
        propertiesInfo : '',
        fieldAnalyzer : '',
      }
    },
    methods : {
      /**
       * 타입의 초기값을 설정한다.
       */
      initValue : function () {
        this.typeName = 'info'
      },

      /**
       * 필드 매핑 설정 정보를 조회한다.
       */
      getFieldSetting : function () {
        const sEunjeonAnalyzer = {
          type: "text",
          analyzer : "korean",
          search_analyzer : "korean"
        }

        const sEunjeonBoostAnalyzer = {
          type: "text",
          analyzer : "korean",
          search_analyzer : "korean",
          boost : 2
        }

        const jmoAnalyzer = {
          type: 'text',
          analyzer : 'hangul_jamo_analyzer',
          search_analyzer : 'hangul_jamo_search_analyzer'
        }

        const keyword = {
          type: 'keyword',
          null_value: 'NULL'
        }

        const yearForamt = {
          type : 'integer',
          null_value : '0'
        }

        const fieldSetting = {
          keyword : keyword,
          jmoAnalyzer : jmoAnalyzer,
          yearForamt : yearForamt,
          sEunjeonAnalyzer : sEunjeonAnalyzer,
          sEunjeonBoostAnalyzer : sEunjeonBoostAnalyzer
        }

        return fieldSetting;
      },

      /**
       * 필드 매핑를 자모 분석기로 설정한다.
       */
      setJamoFields : function () {
        this.fieldAnalyzer = 'jamo'
        const fieldSetting = this.getFieldSetting();

        const fieldArray = {
          movieNm : fieldSetting.jmoAnalyzer,
          movieNmEn : fieldSetting.jmoAnalyzer
        }

        this.reqBody = JSON.stringify(fieldArray, undefined, 2);
      },

      /**
       * 필드 매핑를 s은전한닢 분석기로 설정한다.
       */
      setSEunjeonFeilds : function () {
        this.fieldAnalyzer = 'sEunjeon'
        const fieldSetting = this.getFieldSetting();

        const fieldArray = {
          movieNm : fieldSetting.sEunjeonBoostAnalyzer,
          movieNmEn : fieldSetting.sEunjeonAnalyzer,
          prdtYear : fieldSetting.yearForamt,
          openDt : fieldSetting.yearForamt,
          genreAlt : fieldSetting.keyword
        }

        this.reqBody = JSON.stringify(fieldArray, undefined, 2);
      },

      /**
       * 인덱스 필드 매핑 정보를 조회한다.
       */
      getIndexMapping : function () {
        const indexName  = this.indexName;
        const self = this;
        es_indices.getMapping(indexName).then((result) => {
          self.propertiesInfo = JSON.stringify(result, undefined, 2);
        })
      },

      /**
       * 인덱스 필드 매핑을 설정한다.
       */
      putFieldMapping : function () {
        const indexName  = this.indexName;
        const typeName = this.typeName;
        const reqBody = JSON.parse(this.reqBody);

        es_indices.putMapping(indexName, typeName, reqBody).then( (result) => {
          if(typeof result !== 'undefined' && result !== null && result.acknowledged === true){
            window.location.reload(true);
          }
        })

      }
    }
  }

</script>

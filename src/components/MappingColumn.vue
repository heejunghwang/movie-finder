<template>
  <div>
    <Menu></Menu>
    <br>
    <h1>{{indexName}} Mapping Manage <img src="../assets/black2-manage.png" style="width: 60px"></h1>
    <hr>
    <div class="container-fluid">
      <div class="row">
        <div class="col-5 sidebar">
          <h2 style="float:left">current {{indexName}} Field Info</h2>
          <textarea class="form-control" rows="35" cols="30" readonly="true">{{ propertiesInfo }}</textarea>
        </div>



        <div class="col-lg-6">
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

            <!--<div class="form-group row">-->
              <!--<div class="col-sm-10">-->
                <!--<button type="submit" class="btn btn-primary">Sign in</button>-->
              <!--</div>-->
            <!--</div>-->
            <a href="javascript:;" class="btn btn-secondary router-link-exact-active router-link-active" @click="putFieldMapping">생성</a>
          </form>


            <!--<div class="form-group">-->
              <!--<div class="row">-->
                <!--<p>Index 이름</p>-->
                <!--<div class="col-lg-6">-->
                  <!--<div class="input-group">-->
                    <!--<input class="form-control" aria-label="Text input" v-model="indexName" readonly="true">-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div class="row">-->
                <!--<p>Type 이름</p>-->
                <!--<div class="col-lg-6">-->
                  <!--<div class="input-group">-->
                    <!--<input class="form-control" aria-label="Text input" v-model="typeName">-->
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
            <!--</div>-->




        </div>


      </div>









    </div>


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

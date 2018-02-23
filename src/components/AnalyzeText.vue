<template>

  <div>
    <!-- Menu-->
    <Menu></Menu>
    <br>
    <h1></h1>
    <!--container-->
    <div class="container">
      <!--<h1>Analyze Text</h1>-->
      <div class="form-group">
        <label for="indexName" style="float:left">* 인덱스 :</label>
        <input type="text" class="form-control" id="indexName" placeholder="indexName" v-model="indexName">
      </div>

      <div class="form-group">
        <small id="emailHelp" class="form-text text-muted">WRITE SOMETHING FOR TESTING ANALYZER</small>
        <textarea class="form-control" rows="3" cols="10" v-model="testText">{{ testText }}</textarea>
      </div>

      <br>

      <!-- 분석기 종류-->
      <div class="form-check">
        <input class="form-check-input" type="radio" id="analyzer1" v-model="analyzer" value="korean" @click="setAnalyzer('korean')">
        <label class="form-check-label" for="analyzer1">
          s은전한닢
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" id="analyzer2" v-model="analyzer" value="hangul_chosung_analyzer" @click="setAnalyzer('chosung')">
        <label class="form-check-label" for="analyzer2">
          초성분석
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" id="analyzer3" v-model="analyzer" value="hangul_jamo_analyzer" @click="setAnalyzer('jamo')">
        <label class="form-check-label" for="analyzer3">
          자모분석
        </label>
      </div>

      <br>

      <button class="btn btn-secondary" type="button" @click="analyzeText">분석</button>
      <div v-for="token in tokens"><span>{{token}}</span></div>
    </div>
    <!-- //end of container-->
  </div>
</template>

<script>

  import es_indices from '../api/indices.js';

  export default {
    name: 'AnalyzeText',
    created : function () {
      this.indexName = 'movie'
      this.testText =  '아버지가방에들어가신다'
      this.analyzer = 'korean'
    },
    data () {
      return {
        indexName : '',
        testText : '',
        analyzer : '',
        tokens : ''
      }
    },
    methods : {
      /**
       * Analyze Text using analyzer
       * 텍스트를 분석기를 통해 분석한다
       */
      analyzeText : function () {
        const self = this;
        self.tokens = '';
        es_indices.analyze(this.indexName, this.analyzer, this.testText).then((result)=>{
          self.tokens = result.tokens;
        })
      },

      /**
       * Analyzer Setting
       * 분석기를 설정한다
       * @param analyzer
       */
      setAnalyzer : function (analyzer) {
        if(analyzer == 'korean'){
          this.indexName = 'movie'
        }else{
          this.indexName = 'movie_autocomplete'
        }
      }
    }
  }


</script>

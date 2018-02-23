<template>

  <div>
    <!-- Menu-->
    <Menu></Menu>
    <br>
    <h1></h1>
    <!--container-->
    <div class="container">
      <h1>Import Data from JSON file</h1>
      <button @click="clickBulkIndex('movie')" class="btn btn-link"> <img src="../assets/import-icon.png" style="width: 80px"><h2>movie</h2></button>
      <button @click="clickBulkIndex('movie_autocomplete')" class="btn btn-link"> <img src="../assets/import-icon.png" style="width: 80px"><h2>movie_autocomplete</h2></button>
      <div style="background: lightgray">
        <span style="font-weight:bold">SAMPLE JSON</span>
        <textarea rows="20" cols="30" readonly="readonly" class="form-control">{{ sampleData }}</textarea>
      </div>
    </div>
    <!-- //end of container-->
  </div>
</template>

<script>

  import es_bulk from '../api/bulk.js';
  const each = require('foreach');

  export default {
    name: 'ImportData',
    created : function () {
      this.showSampleData();
    },
    data () {
      return {
        sampleData : '',
        movieResult : '',
        fileSeq : 0,
      }
    },
    methods : {
      /**
       * 샘플 데이터 형태를 보여준다.
       */
      showSampleData : function () {
        const sampleData = {
          "movieCd":"20173732",
          "movieNm":"살아남은 아이",
          "movieNmEn":"Last Child",
          "prdtYear":"2017",
          "openDt":"",
          "typeNm":"장편",
          "prdtStatNm":"기타",
          "nationAlt":"한국",
          "genreAlt":"드라마,가족",
          "repNationNm":"한국",
          "repGenreNm":"드라마",
          "directors":[
            {
              "peopleNm":"신동석"
            }
          ],
          "companys":[

          ]
        };

        this.sampleData = JSON.stringify(sampleData, undefined, 2);

      },

      /**
       * Bulk 색인을 클릭한다.
       * @param indexName
       */
      clickBulkIndex : function(indexName){
        this.fileSeq = 0;
        this.startBulkIndex(indexName);
      },

      /**
       * JSON 데이터를 가져온다.
       */
      getDataFromJSON : function () {
        this.fileSeq = this.fileSeq + 1;
        this.movieResult = [];
        let movieRawList = require('../rawdata/searchMovieList_'+ this.fileSeq + '.json');
        this.movieResult = movieRawList.movieListResult.movieList;
        this.refineData()
      },

      /**
       * JSON 데이터를 정제한다
       */
      refineData : function () {
        each(this.movieResult, (value, key, array) => {
          if(value.genreAlt !== "" && value.genreAlt !== null && typeof value.genreAlt !== 'undefined'){
            // Array 형태로 담기 위해서 슬래시(/)나 괄호로 되어 있는 장르명을 치환시켜줍니다
            value.genreAlt = value.genreAlt.toString();
            value.genreAlt = value.genreAlt.split("/").join(",");
            value.genreAlt = value.genreAlt.split("(").join(",");
            value.genreAlt = value.genreAlt.split(")").join(",");
            var temp = new Array();
            temp = value.genreAlt.split(",");
            value.genreAlt = temp;
          }
        })
      },

      /**
       * Bulk 색인을 시작한다.
       * @param indexName
       */
      startBulkIndex : function (indexName) {
        const self = this;
        console.log("start to import data of " + indexName)
        this.getDataFromJSON();
        es_bulk.bulkIndex(indexName, 'info', this.movieResult).then((result) => {
          if(result == true){
            console.log('####### finish to import data of ' + indexName + ' ' + self.fileSeq)
            if(self.fileSeq < 7){
              self.startBulkIndex(indexName);
            }
          }
        });
      },


    },

  }


</script>

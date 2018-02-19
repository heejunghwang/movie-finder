<template>

  <div>
    <!-- Menu-->
    <Menu></Menu>
    <br>
    <h1></h1>
    <!--container-->
    <div class="container">
      <h1>Import Data from JSON file</h1>
      <button @click="clickBulkInsert('movie')" class="btn btn-link"> <img src="../assets/import-icon.png" style="width: 80px"><h2>movie</h2></button>
      <button @click="clickBulkInsert('movie_autocomplete')" class="btn btn-link"> <img src="../assets/import-icon.png" style="width: 80px"><h2>movie_autocomplete</h2></button>
      <div style="background: lightgray">
        <span style="font-weight:bold">SAMPLE JSON</span>
        <textarea rows="20" cols="30" readonly="readonly" class="form-control">{{ sampleData }}</textarea>
      </div>
    </div>
    <!-- //end of container-->
  </div>
</template>

<script>

  import rawData from '../rawdata/searchMovieList_1.json';
  import es_bulk from '../api/bulk.js';
  const each = require('foreach');

  export default {
    name: 'ImportData',
    created : function () {
      this.showSampleData();
      this.getDataFromJSON();
    },
    data () {
      return {
        sampleData : '',
        movieResult : ''
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
       * JSON 데이터를 가져온다.
       */
      getDataFromJSON : function () {
        this.movieResult = rawData.movieListResult.movieList;
      },

      /**
       * Bulk 색인을 클릭한다.
       * @param indexName
       */
      clickBulkInsert : function(indexName){
        const self = this;
        each(this.movieResult, function (value, key, array) {
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
        this.startBulkInsert(indexName);
      },

      /**
       * Bulk 색인을 시작한다.
       * @param indexName
       */
      startBulkInsert : function (indexName) {
        es_bulk.bulkIndex(indexName, 'info', this.movieResult);
      },


    },

  }


</script>

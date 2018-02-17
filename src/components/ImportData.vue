<template>

  <div>
    <!-- Menu-->
    <Menu></Menu>
    <br>
    <h1></h1>
    <!--container-->
    <div class="container">
      <h1>Import Data from JSON file</h1>
      <button @click="startBulkInsert" class="btn btn-link"> <img src="../assets/import-icon.png" style="width: 80px"></button>
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
      this.setSampleData()
    },
    data () {
      return {
        sampleData : '',
        movieResult : ''
      }
    },
    methods : {
      setSampleData : function () {
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
      getDataFromJSON : function () {
        this.movieResult = rawData.movieListResult.movieList;
      },
      startBulkInsert : function () {
        this.getDataFromJSON();
        //TODO : 장르는 Array 형태로 색인하도록
        const self = this;
        each(this.movieResult, function (value, key, array) {
          if(value.genreAlt !== ""){
            // Array 형태로 담기 위해서 슬래시(/)나 괄호로 되어 있는 장르명을 치환시켜줍니다
            value.genreAlt = value.genreAlt.replace("/", ",");
            value.genreAlt = value.genreAlt.replace("(", ",");
            value.genreAlt = value.genreAlt.replace(")", "");
            var temp = new Array();
            temp = value.genreAlt.split(",");
            value.genreAlt = temp;
          }
        })

        es_bulk.bulkIndex('movie', 'info', self.movieResult);
        es_bulk.bulkIndex('movie_autocomplete', 'info', self.movieResult);

      }
    }
  }


</script>

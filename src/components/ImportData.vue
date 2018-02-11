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
        <code>
          <pre>
          {
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
          }
          </pre>
        </code>
      </div>
    </div>
    <!-- //end of container-->
  </div>
</template>

<script>

  import rawData from '../rawdata/searchMovieList_1.json';
  import es_bulk from '../api/bulk.js';

  export default {
    name: 'ImportData',
    created : function () {
      this.getDataFromJSON()
    },
    data () {
      return {
        movieResult : ''
      }
    },
    methods : {
      getDataFromJSON : function () {
        this.movieResult = rawData.movieListResult.movieList;
      },
      startBulkInsert : function () {
        //TODO : 장르는 Array 형태로 색인하도록
        const self = this;
        es_bulk.bulkIndex('movie', 'info', self.movieResult);

      }
    }
  }


</script>

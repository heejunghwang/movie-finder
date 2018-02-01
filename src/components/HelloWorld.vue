<template>
  <div>
    <!-- Menu-->
    <Menu></Menu>
    <br>
    <!--container-->
    <div class="container">

      <!-- 사용자 검색 영역-->
      <div class="row">
        <div class="col-lg-6">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Search for...">
            <span class="input-group-btn">
              <button class="btn btn-secondary" type="button" @click="clickSearch">Go!</button>
            </span>
          </div>
        </div>
      </div>

      <br>

      <!-- 검색 결과-->
      <table class="table table-striped" v-if="movieResult !== ''">
        <th>이름</th>
        <th>장르</th>
        <tbody>
        <tr v-for="movie in movieResult">
          <td>{{ movie.movieNm }}</td>
          <td>{{ movie.genreAlt }}</td>
        </tr>
        </tbody>
      </table>

    </div>
    <!-- //end of container-->
  </div>
</template>

<script>


  export default {
  name: 'HelloWorld',
  data () {
    return {
      movieResult : ''/* [{
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
      },
        {
          "movieCd":"20179163",
          "movieNm":"반도에 살어리랏다",
          "movieNmEn":"I'll Just Live in Bando",
          "prdtYear":"2017",
          "openDt":"20180125",
          "typeNm":"장편",
          "prdtStatNm":"개봉예정",
          "nationAlt":"한국",
          "genreAlt":"애니메이션,코미디",
          "repNationNm":"한국",
          "repGenreNm":"애니메이션",
          "directors":[
            {
              "peopleNm":"이용선"
            }
          ],
          "companys":[

          ]
        }]*/
    }
  },
  methods : {
    clickSearch : function () {
      //TODO : 키보드 이벤트마다 검색
      console.log("클릭클릭")
    }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*h1, h2 {*/
  /*font-weight: normal;*/
/*}*/
/*ul {*/
  /*list-style-type: none;*/
  /*padding: 0;*/
/*}*/
/*li {*/
  /*display: inline-block;*/
  /*margin: 0 10px;*/
/*}*/
/*a {*/
  /*color: #42b983;*/
/*}*/
</style>

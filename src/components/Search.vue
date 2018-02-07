<template>

  <div>
    <!-- Menu-->
    <Menu></Menu>
    <br>
    <!--container-->
    <div class="container-fluid">
      <!-- 사용자 검색 영역-->
      <div class="row">
        <div class="col-2 sidebar">
          <!-- TODO : UNIQUE 한것만 추출-->
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Dark
              <span class="badge badge-primary badge-pill">14</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Dark
              <span class="badge badge-primary badge-pill">14</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Dark
              <span class="badge badge-primary badge-pill">14</span>
            </li>
          </ul>
        </div>

        <div class="col-lg-6">
          <div class="input-group" style="margin-bottom: 30px">
            <input type="text" class="form-control" placeholder="Search for..." v-on:input="clickSearch" v-bind:value="userQuery">
            <span class="input-group-btn">
              <button class="btn btn-secondary" type="button" @click="clickSearch">Go!</button>
            </span>
          </div>

          You selected...
          <div class="input-group">
            <button type="button" class="btn btn-outline-dark" style="margin-right: 5px">영화 x</button>
            <button type="button" class="btn btn-outline-dark" style="margin-right: 5px">영화 x</button>
            <button type="button" class="btn btn-outline-dark" style="margin-right: 5px">영화 x</button>
            <button type="button" class="btn btn-outline-dark" style="margin-right: 5px">영화 x</button>
          </div>

          <p style="float:right">총 : {{ total }} 건</p>
          <!-- 검색 결과-->
          <table class="table table-striped" v-if="movieResult !== ''">
            <th>이름</th>
            <th>장르</th>
            <tbody>
            <tr v-for="movie in movieResult">
              <td>{{ movie.movieNm }}</td>
              <td>{{ movie.genreAlt }}</td>
            </tr>
            <tr>
              <!-- TODO : 더보기 페이지 처리-->
              <td colspan="2" v-if="movieResult !== '' && movieResult.length > 0">더보기</td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- //end of col-->
      </div>
      <!--//end of row-->
    </div>
    <!-- //end of container-->


  </div>
</template>

<script>

  //TODO : total 콤마 찍어주기

  import es_search from '../api/search.js';
  const each = require('foreach');

  export default {
  name: 'Search',
  created : function () {
    this.init();
  },
  data () {
    return {
      userQuery : '',
      total : 0,
      movieResult : []/* [{
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
    init : function () {
     this.search();
    },
    search : function (bodyReq) {
      const self = this;
      const indexName = 'movie'
      if(typeof bodyReq === 'undefined' || bodyReq === null){
        bodyReq = '';
      }

      const reqParam = {
        'index' : indexName,
        'body' : bodyReq
      };

      self.movieResult = [];
      es_search.search(reqParam).then(function(result){
        self.total = result.hits.total;
        each(result.hits.hits, function (value, key, array) {
          self.movieResult.push(value._source)
        })
      })
    },
    clickSearch : function (e) {
      this.userQuery = e.target.value
      let bodyReq = {
        query : {
          match : {
            movieNm : this.userQuery
          }
        }
      }
      this.search(bodyReq)
    }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

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
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center" @click="search(null)">
              <span style="font-weight: bold">장르별</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center" v-bind:class="{active : item.active}" v-for="item in uniqueGenre" @click="clickGenre(item)">
              <span v-if="typeof item.key !== 'undefined' && item.key !== null && item.key !== ''">{{item.key}}</span>
              <span v-else>기타</span>
              <span class="badge badge-primary badge-pill">{{commaNumber(item.doc_count)}}</span>
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
            <div v-for="item in userSelected"> <button type="button" class="btn btn-outline-dark" style="margin-right: 5px">{{ item }} x</button> </div>
          </div>

          <p style="float:right">총 : {{ commaNumber(total) }} 건</p>
          <!-- 검색 결과-->
          <table class="table table-striped" v-if="movieResult !== ''">
            <th>이름</th>
            <th>장르</th>
            <th>타입</th>
            <th>개봉년</th>
            <th>제작사</th>
            <tbody>
            <tr v-for="movie in movieResult">
              <td>{{ movie.movieNm }}</td>
              <td>{{ movie.genreAlt }}</td>
              <td>{{ movie.typeNm }}</td>
              <td>{{ movie.prdtYear }}</td>
              <td><span v-if="movie.companys.length !== 0">{{ movie.companys[0].companyNm }}</span></td>
            </tr>
            <tr>
              <!-- TODO : 더보기 페이지 처리-->
              <td colspan="5" v-if="movieResult !== '' && movieResult.length > 0">더보기</td>
            </tr>
            </tbody>
          </table>

          <div style="float:right; font-size:smaller">데이터 출처 : 영화진흥위원회</div>
        </div>
        <!-- //end of col-->
      </div>
      <!--//end of row-->
    </div>
    <!-- //end of container-->


  </div>
</template>

<script>

  //TODO : 하이라이팅


  import es_search from '../api/search.js';
  const each = require('foreach');
  const commaNumber = require('comma-number')

  export default {
  name: 'Search',
  created : function () {
    this.init();
    this.getUniqueSearch();
  },
  data () {
    return {
      indexName : 'movie',
      userQuery : '',
      userSelected : [],
      total : 0,
      uniqueGenre : '',
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
      if(typeof bodyReq === 'undefined' || bodyReq === null){
        bodyReq = '';
      }

      //TODO : 데이터로 옮기기
      const reqParam = {
        'index' : this.indexName,
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
        sort : [
          { 'openDt' : {order : 'asc'}}
        ],
        query: {
          bool: {
            should: {
              match: {
                movieNm: this.userQuery
              }
            },
          }
        }
      }
      this.search(bodyReq)
    },
    commaNumber : function (number) {
      return commaNumber(number)
    },
    getUniqueSearch : function () {
      let bodyReq = {
        size: 0,
        aggs : {
          uniq_genre : {
            terms : { field : "genreAlt" },
          },
        }
      }

      const reqParam = {
        'index' : this.indexName,
        'body' : bodyReq
      };

      const self = this;
      es_search.search(reqParam).then(function(result){
        self.uniqueGenre = result.aggregations.uniq_genre.buckets
      })
    },
    clickGenre : function (item) {
      this.userSelected .push(item.key)
      each(this.uniqueGenre, function (value, key, array) {
        if(item.key === value.key){
          if(value.active == true){
            value.active = false;
          }else{
            value.active = true
          }
        }
      })

      //TODO : 멀티 장르로 검색할 수 있도록 수정
      let bodyReq = {
        sort : [
          { 'prdtYear' : {order : 'desc'}}
        ],
        query: {
          bool: {
            must : {
              match : {
                genreAlt : item.key
              }
            },
            should: {
              match: {
                movieNm: this.userQuery
              }
            },
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

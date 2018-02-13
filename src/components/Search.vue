<template>

  <div>
    <!-- Menu-->
    <Menu></Menu>
    <br>
    <!--container-->
    <div class="container-fluid">
      <!-- 사이드바-->
      <div class="row">
        <div class="col">
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span style="font-weight: bold">장르별</span>
              <span style="font-size:smaller" @click="initGenre()">초기화<img src="../assets/refresh.png" style="width: 20px"></span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-action list-group-item-light" v-bind:class="{active : item.active}" v-for="item in uniqueGenre" @click="clickGenre(item)">
              <span v-if="typeof item.key !== 'undefined' && item.key !== null && item.key !== ''">{{item.key}}</span>
              <span v-else>기타</span>
              <span class="badge badge-dark">{{commaNumber(item.doc_count)}}</span>
            </li>
          </ul>
        </div>

        <br>

        <div class="col-lg-9">
          <!-- 검색-->
          <div class="input-group" style="margin-bottom: 30px">
            <input type="text" class="form-control" placeholder="Search for..." v-on:input="typeKeyword" v-bind:value="userQuery">
            <span class="input-group-btn">
              <button class="btn btn-secondary" type="button" @click="typeKeyword">Go!</button>
            </span>
          </div>

          <!-- 검색 결과-->
          <p style="float:right">총 : {{ commaNumber(total) }} 건</p>
          <table class="table table-striped" v-if="movieResult !== ''">
            <th>이름</th>
            <th>장르</th>
            <th>타입</th>
            <th>개봉년도</th>
            <th>제작사</th>
            <tbody>
            <tr v-for="movie in movieResult">
              <td>{{ movie.movieNm }}</td>
              <td>
                <span v-for="genre in movie.genreAlt">{{ genre }},</span>
              </td>
              <td>{{ movie.typeNm }}</td>
              <td>{{ movie.prdtYear }}</td>
              <td><span v-if="movie.companys.length !== 0">{{ movie.companys[0].companyNm }}</span></td>
            </tr>
            <tr>
              <!-- TODO : 더보기 페이지 처리-->
              <td colspan="5" v-if="movieResult !== '' && movieResult.length > 0" @click="searchMore">더보기</td>
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

  import es_search from '../api/search.js';
  const each = require('foreach');
  const commaNumber = require('comma-number')

  export default {
  name: 'Search',
  created : function () {
    this.init();
  },
  data () {
    return {
      indexName : 'movie',
      userQuery : '',
      userSelected : '',
      total : 0,
      from : 0,
      to : 20,
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
      this.movieResult = [];
      this.startSearch();
      this.getUniqueSearch();
    },
    search : function (bodyReq) {
      const self = this;
      const reqParam = {
        'index' : this.indexName,
        'body' : bodyReq
      };

      console.log(bodyReq)

      self.movieResult = [];
      es_search.search(reqParam).then(function(result){
        self.total = result.hits.total;
        each(result.hits.hits, function (value, key, array) {
          self.movieResult.push(value._source)
        })
      })
    },

    commaNumber : function (number) {
      return commaNumber(number)
    },
    /**
     * 장르별 메뉴 조회
     */
    getUniqueSearch : function () {
      let bodyReq = {
        size: 0,
        query: {
          bool: {
            must_not: {
              term: {
                genreAlt: "성인물"
              }
            }
          }
        },
        aggs : {
          uniq_genre : {
            terms : {
              field : "genreAlt"
            }
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
    /**
     * 장르 선택 초기화
     */
    initGenre : function () {
      each(this.uniqueGenre, function (value, key, array) {
        value.active = false;
      })
      this.userSelected = ''
      this.startSearch()
    },
    /**
     * 장르 클릭
     * @param item
     */
    clickGenre : function (item) {
      const self = this;
      self.userSelected = item.key;
      each(this.uniqueGenre, function (value, key, array) {
        if(item.key === value.key){
          if(value.active == true){
            value.active = false;
            self.userSelected = ''
          }else{
            value.active = true;
          }
        }else{
          value.active = false;
        }
      })

      this.startSearch();
    },

    /**
     * 키워드 검색 시
     * @param e
     */
    typeKeyword : function (e) {
      this.userQuery = e.target.value;
      this.startSearch();
    },
    /**
     * 검색을 한다
     */
    startSearch : function () {
      let bodyReq = this.setSearchParam();
      this.movieResult = []
      this.search(bodyReq)
    },
    /**
     * 검색 파라미터 세팅
     * @returns {{from: number, size: number, sort: *[], query: {bool: {must_not: {match: {genreAlt: string}}}}}}
     */
    setSearchParam : function () {
      let bodyReq = {
        from : 0,
        size : 20,
        sort : [
          { 'prdtYear' : {order : 'desc'}},
          {"_id": "desc"}
        ],
        query: {
          bool: {
            // must : {
            //   match : {
            //     genreAlt : this.userSelected
            //   }
            // },
            must_not : {
              match : {
                genreAlt : "성인물"
              }
            },
            // should: {
            //   match: {
            //     movieNm: this.userQuery
            //   }
            // },
          }
        }
      }

      if(this.userSelected !== '') {
        let genreAltQuery = {
          match: {
            genreAlt: this.userSelected
          }
        };
        bodyReq.query.bool.must = genreAltQuery;
      }

      if(this.userQuery !== '') {
        let userQuery = {
            match: {
              movieNm: this.userQuery
            }
        };
        bodyReq.query.bool.should = userQuery;
      }

      return bodyReq;
    },
    /**
     * 더보기 클릭 시
     */
    searchMore : function () {
      this.to = this.to + 20;
      this.from = this.to;
      //TODO : 선택 장르와 사용자 키워드 확인
      //TODO : 선택 장르가 해제되거나 사용자 키워드가 바뀔때는 초기화
      //this.search()
    }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

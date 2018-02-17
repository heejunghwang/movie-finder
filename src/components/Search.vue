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
          <div v-on-clickaway="focusOut">
            <!-- 검색-->
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Search for..." v-on:input="typeKeyword" v-bind:value="userQuery" @keydown="moveAutocopleteItem"> <!-- @blur="focusOut" -->
              <span class="input-group-btn">
                <button class="btn btn-secondary" type="button" @click="goSearch">Go!</button>
              </span>
            </div>
            <!-- 자동완성-->
            <ul class="suggestion">
              <li v-for="movie in autoCompleteList" @click="selectAutocompleteKeyword(movie)">{{ movie.movieNm }}</li>
            </ul>
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
  import { directive as onClickaway } from 'vue-clickaway';

  export default {
  name: 'Search',
  created : function () {
    this.init();
  },
  directives: {
    onClickaway: onClickaway,
  },
  data () {
    return {
      indexName : 'movie',
      userQuery : '',
      userSelected : '',
      total : 0,
      from : 0,
      size : 20,
      uniqueGenre : '',
      autoCompleteList : [],
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
      // this.startSearch();
      this.getUniqueSearch();
    },
    search : function (indexName, bodyReq) {
      const self = this;
      const reqParam = {
        'index' : indexName,
        'body' : bodyReq
      };

      console.log(bodyReq)

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
      this.initPage();
      each(this.uniqueGenre, function (value, key, array) {
        value.active = false;
      })
      this.userSelected = ''
      this.startSearch()
    },
    /**
     * 페이징 초기화
     */
    initPage : function () {
      this.from = 0;
    },
    /**
     * 장르 클릭
     * @param item
     */
    clickGenre : function (item) {
      this.initPage();
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
     * 키워드 검색 시 자동완성어 검색
     * @param e
     */
    typeKeyword : function (e) {
      this.userQuery = e.target.value;
      this.getAutoCompleteResult();
    },
    /**
     * 사용자의 질의 검색
     */
    goSearch : function () {
      this.focusOut();
      this.startSearch();
    },
    /**
     * 자동완성 결과 검색
     */
    getAutoCompleteResult : function () {
      let bodyReq = {
        size: 10,
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

      const self = this;
      const reqParam = {
        'index' : 'movie_autocomplete',
        'body' : bodyReq
      };

      self.autoCompleteList = [];

      if(this.userQuery !== null && this.userQuery !== ""){
        es_search.search(reqParam).then(function(result){
          each(result.hits.hits, function (value, key, array) {
            self.autoCompleteList.push(value._source)
          })
        })
      }

    },

    /**
     * 검색을 한다
     */
    startSearch : function () {
      let bodyReq = this.setSearchParam();
      this.movieResult = []
      this.search('movie', bodyReq)
    },
    /**
     * 검색 파라미터 세팅
     * @returns {{from: number, size: number, sort: *[], query: {bool: {must_not: {match: {genreAlt: string}}}}}}
     */
    setSearchParam : function () {
      let bodyReq = {
        from : this.from,
        size : this.size,
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
      this.from = this.from + this.size;
      let bodyReq = this.setSearchParam();
      this.search('movie', bodyReq)
    },
    /**
     * 자동완성 포커스 아웃 시 suggestion 초기화
     */
    focusOut : function (e) {
      this.autoCompleteList = [];
    },

    moveAutocopleteItem : function (e) {
      //TODO : 키보드 움직였을 때
      //left
      if(event.keyCode == 37) {
        console.log("left")
      }
      //top
      else if(event.keyCode == 38) {
        console.log("top")
      }
      //right
      else if(event.keyCode == 39) {
        console.log("right")
      }
      //bottom
      else if(event.keyCode == 40) {

        console.log("bottom")
      }
    },
    selectAutocompleteKeyword : function (movie) {
      this.userQuery = movie.movieNm
      this.autoCompleteList = [];
      //TODO : 자동완성어 검색
      //this.startSearch();
    }
  }

}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .suggestion {
    list-style-type: none;
    margin-right: 55px;
    padding: 0;
    border : 1px solid lightgray;
    text-align: left;
    font-size:smaller;
  }

  .suggestion li {
    margin:10px 20px;
    border-bottom: 1px solid lightgray;
  }

  .suggestion li:last-child {
    border: none;
  }


  .suggestion li:hover {
    background-color: #F3F0DC;
  }
</style>

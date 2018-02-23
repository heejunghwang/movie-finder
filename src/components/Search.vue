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
            <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-action list-group-item-light" v-if="typeof item.key !== 'undefined' && item.key !== null && item.key !== ''" v-bind:class="{active : item.active}" v-for="item in uniqueGenre" @click="clickGenre(item)">
              <span>{{item.key}}</span>
              <span class="badge badge-dark">{{commaNumber(item.doc_count)}}</span>
            </li>
          </ul>
        </div>

        <div class="col-lg-9" style="margin-top: 20px">
          <div v-on-clickaway="focusOut">
            <!-- 검색-->
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Search for..." v-on:input="typeKeyword" v-bind:value="userQuery" @keydown="moveAutocopleteItem" v-on:keyup.enter="goSearch">
              <span class="input-group-btn">
                <button class="btn btn-secondary" type="button" @click="goSearch">Go!</button>
              </span>
            </div>
            <!-- 자동완성-->
            <ul class="suggestion">
              <li v-for="movie in autoCompleteList" @mouseover="mouseOverAutocomplete(movie)" @click="selectAutocompleteKeyword(movie)" v-bind:class="{active:movie.active}">{{ movie.movieNm }}</li>
            </ul>
          </div>

          <!-- 검색 결과-->
          <table class="table table-striped" v-if="movieResult !== ''">
            <th>이름</th>
            <th>장르</th>
            <th>타입</th>
            <th>개봉년도</th>
            <th>Score</th>

            <tbody>
            <tr v-for="movie in movieResult">
              <td>{{ movie.movieNm }}</td>
              <td>
                <span v-for="genre in movie.genreAlt" class="comma">{{ genre }}</span>
              </td>
              <td>{{ movie.typeNm }}</td>
              <td>{{ movie.prdtYear }}</td>
              <td>{{ movie._score }}</td>
            </tr>
            <tr>
              <td colspan="6" v-if="movieResult !== '' && movieResult.length > 0"><button class="btn btn-dark" @click="searchMore">더보기</button></td>
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
    /**
     * 초기값으로 설정한다.
     */
    init : function () {
      this.movieResult = [];
      this.getUniqueSearch();
    },

    /**
     * 숫자에 콤마 표시를 한다.
     */
    commaNumber : function (number) {
      return commaNumber(number)
    },

    /**
     * 장르별 메뉴 조회를 한다.
     */
    getUniqueSearch : function () {
      let bodyReq = {
        size: 0,
        query: {
          bool: {
            must_not: {
            },
          }
        },
        aggs : {
          uniq_genre : {
            terms : {
              field : "genreAlt",
              size: 10000
            }
          },
        }
      }

      bodyReq.query.bool.must_not = this.getFilterWords();

      const reqParam = {
        'index' : this.indexName,
        'body' : bodyReq
      };

      const self = this;
      es_search.search(reqParam).then((result)=>{
        self.uniqueGenre = result.aggregations.uniq_genre.buckets
      })
    },

    /**
     * 장르 선택 초기화를 한다.
     */
    initGenre : function () {
      this.initPage();
      each(this.uniqueGenre, (value, key, array) =>{
        value.active = false;
      })
      this.userSelected = ''
      this.startSearch()
    },

    /**
     * 페이징 초기화을 한다.
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
      each(this.uniqueGenre, (value, key, array) => {
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
      if(this.userQuery === ""){
        this.autoCompleteList = [];
      }else{
        this.getAutoCompleteResult();
      }
    },

    /**
     * 사용자의 질의 검색
     */
    goSearch : function () {
      this.initPage();
      this.focusOut();
      this.startSearch();
    },

    /**
     * 필터링 할 단어를 가져온다.
     */
    getFilterWords : function () {
      let filterWords = [
        {match: {"genreAlt":"성인물"}},
        {match: {"genreAlt":"에로"}},
        {match: {"companys.companyNm":"(주)영화사가을"}},
        {match: {"companys.companyNm":"스마일컨텐츠"}},
        {match: {"companys.companyNm":"(주)리필름"}},
        {match: {"companys.companyNm":"영화사 인연"}},
        {match: {"companys.companyNm":"너바나 필름"}},
        {match: {"companys.companyNm":"배드픽쳐스"}},
        {match: {"companys.companyNm":"이돌영화사"}},
        {match: {"companys.companyNm":"전망 PRODUCTION"}},
        {match: {"companys.companyNm":"무비집"}},
        {match: {"companys.companyNm":"엠아이픽쳐스 "}},
        {match: {"companys.companyNm":"블루스필름"}},
        {match: {"companys.companyNm":"핵존슨"}},
        {match: {"companys.companyNm":"모히또필름"}},
        {match: {"companys.companyNm":"에이원 미디어"}},
        {match: {"companys.companyNm":"제이프러스미디어"}},
        {match: {"companys.companyNm":"에이원 미디어"}},
        {match: {"companys.companyNm":"윤스"}},
        {match: {"companys.companyNm":"(유)조이앤컨텐츠그룹"}},
        {match: {"companys.companyNm":"(유)쏘아필름"}},
        {match: {"companys.companyNm":"주식회사 레드아이스"}},
        {match: {"companys.companyNm":"신필름"}},
        {match: {"companys.companyNm":"시네마테크 충무로"}}
      ]
      return filterWords;
    },

    /**
     * 자동완성 결과 검색을 한다.
     */
    getAutoCompleteResult : function () {
      let bodyReq = {
        from : 0,
        size: 10,
        query: {
          bool: {
             filter : [],
             should: {
               match: {
                 movieNm: this.userQuery
               }
             },
          }
        }
      }

      bodyReq.query.bool.must_not = this.getFilterWords();

      const self = this;
      const reqParam = {
        'index' : 'movie_autocomplete',
        'body' : bodyReq
      };

      if(this.userQuery !== null && this.userQuery !== ""){
        es_search.search(reqParam).then((result) => {
          self.autoCompleteList = [];
          each(result.hits.hits, (value, key, array) => {
            self.autoCompleteList.push(value._source)
          })
        })
      }
    },

    /**
     * 검색을 시작 한다
     */
    startSearch : function () {
      let bodyReq = this.setSearchParam();
      this.movieResult = [];
      this.search('movie', bodyReq)
    },

    /**
     * 검색 파라미터 세팅을 한다.
     * @returns {{from: number, size: number, sort: *[], query: {bool: {must_not: {match: {genreAlt: string}}}}}}
     */
    setSearchParam : function () {
      let bodyReq = {
        from : this.from,
        size : this.size,
        query:{
          bool:{
            filter : [],
          }
        }
      }

      bodyReq.query.bool.must_not = this.getFilterWords()

      if(this.userSelected !== '' && this.userQuery !== ''){
        let genreUserQuery = {
          match: {
            genreAlt: this.userSelected
          }
        };
        let userQuery = {
          match: {
            movieNm: this.userQuery
          }
        };
        bodyReq.query.bool.must = genreUserQuery;
        bodyReq.query.bool.should = userQuery;

      } else if(this.userSelected !== '') {
        let genreAltQuery = {
          match: {
            genreAlt: this.userSelected
          }
        };
        bodyReq.query.bool.must = genreAltQuery;

      } else{
        let userQuery = {
          match: {
            movieNm: this.userQuery
          }
        };
        bodyReq.query.bool.must = userQuery;
      }

      return bodyReq;
    },

    /**
     * 엘라스틱서치 검색 API 호출을 한다
     */
    search : function (indexName, bodyReq) {
      const self = this;
      const reqParam = {
        'index' : indexName,
        'body' : bodyReq
      };

      es_search.search(reqParam).then((result)=>{
        each(result.hits.hits, (value, key, array) => {
          let itemMovie = value._source;
          itemMovie._score = value._score
          self.movieResult.push(itemMovie)
        })
      })
    },

    /**
     * 더보기 리스트를 조회한다.
     */
    searchMore : function () {
      this.from = this.from + this.size;
      let bodyReq = this.setSearchParam();
      this.search('movie', bodyReq)
    },

    /**
     * 자동완성 포커스 아웃 시 자동완성을 초기화를 한다.
     */
    focusOut : function () {
      this.autoCompleteList = [];
    },

    /**
     * 자동완성에서 위, 아래 버튼을 누를 경우, 자동완성 포커스를 이동한다.
     */
    moveAutocopleteItem : function (event) {
      //left
      if(event.keyCode == 37) {
        this.goDownKeyword();
      }
      //top
      else if(event.keyCode == 38) {
        this.goUpKeyword();
      }
      //right
      else if(event.keyCode == 39) {
        this.goDownKeyword();
      }
      //bottom
      else if(event.keyCode == 40) {
        this.goDownKeyword();
      }
    },

    /**
     * 자동완성 펼친 상태에서 아래 버튼 누를시 포커스 이동을 한다.
     * @returns {boolean}
     */
    goDownKeyword : function () {
      const self = this;
      if(this.autoCompleteList !== [] && this.autoCompleteList !== null && this.autoCompleteList !== ''){
        if(typeof this.autoCompleteList.selected == "undefined"){
          each(this.autoCompleteList, function (value, key, array) {
            if(key == 0){
              value.active = true;
              self.userQuery = value.movieNm
              self.autoCompleteList.selected = key;
            }
          })
        }else if((self.autoCompleteList.selected+2) > this.autoCompleteList.length){
          return false;
        }else{
          self.autoCompleteList.selected = self.autoCompleteList.selected + 1;
          each(this.autoCompleteList, function (value, key, array) {
            if(key == self.autoCompleteList.selected){
              value.active = true;
              self.userQuery = value.movieNm
              self.autoCompleteList.selected = key;
            }else{
              value.active = false;
            }
          })
        }
        this.$forceUpdate()
      }
    },

    /**
     * 자동완성 펼친 상태에서 위 버튼 누를시 포커스 이동을 한다.
     * @returns {boolean}
     */
    goUpKeyword : function () {
      const self = this;
      if(this.autoCompleteList !== [] && this.autoCompleteList !== null && this.autoCompleteList !== ''){
        if(typeof this.autoCompleteList.selected == "undefined"){
          each(this.autoCompleteList, (value, key, array) => {
            if(key == 0){
              value.active = true;
              self.userQuery = value.movieNm
              self.autoCompleteList.selected = key;
            }
          })
        }else if(self.autoCompleteList.selected == 0){
          return false;
        }else{
          self.autoCompleteList.selected = self.autoCompleteList.selected - 1;
          each(this.autoCompleteList, (value, key, array) => {
            if(key == self.autoCompleteList.selected){
              value.active = true;
              self.userQuery = value.movieNm
              self.autoCompleteList.selected = key;
            }else{
              value.active = false;
            }
          })
        }
        this.$forceUpdate()
      }
    },

    /**
     *  자동완성어 리스트에 마우스 올릴 때 커서를 해당 자동완성어로 이동한다.
     * @param movie
     */
    mouseOverAutocomplete : function (movie) {
      const self = this;
      each(this.autoCompleteList, (value, key, array) => {
        if(movie.movieCd == value.movieCd){
          value.active = true;
          self.autoCompleteList.selected = key;
        }else{
          value.active = false;
        }
      })
      this.$forceUpdate()
    },

    /**
     * 자동완성어 클릭시 검색을 한다.
     * @param movie
     */
    selectAutocompleteKeyword : function (movie) {
      this.userQuery = movie.movieNm
      this.autoCompleteList = [];
      this.goSearch();
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

  .suggestion .active{
    background-color: #F3F0DC;
  }

  .comma:not(:empty) ~ .comma:not(:empty):before {
    content: ", ";
  }

</style>

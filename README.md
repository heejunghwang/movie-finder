# movie-finder

## 데이터 출처 : 영화관입장권통합전산망 오픈 API (영화진흥위원회)

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### 폴더 구조 설명
~~~
/config : 설정정보
 ㄴ elasticsearch.env.js : 엘라스틱 서치 호스트 및 포트 정보
/src/api : 엘라스틱서치 api 모음
 ㄴ bulk.js : bulk api
 ㄴ cat.js : cat api
 ㄴ elasticsearchConnection.js : 엘라스틱서치 클라이언트(연결)
 ㄴ indice : index api
 ㄴ search : search api
/assets : 정적 이미지 모음 폴더
/components : vue.js 컴포넌트
/rawdata : 원본데이터 (출처 : 영화진흥위원회)
/router : 라우팅 관련 폴더
 ~~~ 

## 그외
* 사용한 형태소 분석기
- s은전한닢
- 한글 초성검색 자모 분석 플러그인 : https://github.com/punxism/elasticsearch-hangul-jamo-plugin

## 버전 정보
* Java 8
* elasticsearch-6.1.3
* Node.js : 8.9.4

### 추가 자료 : TODO
* 동영상
* 캡쳐

#### 지원 브라우저 : Chrome

## 자바카페 블로그 : http://tech.javacafe.io/
## 자바카페 git : https://github.com/JAVACAFE-STUDY

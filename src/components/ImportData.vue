<template>

  <div>
    <!-- Menu-->
    <Menu></Menu>
    <br>
    <h1>MOVIE</h1>
    <!--container-->
    <div class="container">
      Start import data to elasticsearch~
      <button @click="startBulkInsert">START!!!</button>

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
        //TODO : 몽고DB에 넣기
      },
      startBulkInsert : function () {
        es_bulk.bulkIndex('movie', 'info');
      }
    }
  }


</script>

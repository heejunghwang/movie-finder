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

    </div>
    <!-- //end of container-->
  </div>
</template>

<script>

  //TODO : 데이터 필터링해서 넣기
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
        es_bulk.bulkIndex('movie', 'info', this.movieResult);
      }
    }
  }


</script>

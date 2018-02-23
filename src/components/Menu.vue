<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#"><img src="../assets/javacafe-logo-kor.png" style="width: 100px"></b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <div v-for="item in menuArray">
          <router-link :to="item.link" class="nav-link" v-bind:class="{active : item.active}"><div>{{item.name}}</div></router-link>
        </div>
        <br>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script>

  const each = require('foreach');

  export default {
    name: 'Menu',
    created : function () {
      this.goMenu();
    },

    data () {
      return {
        menuArray: [
          {name : 'Search', link : './', active : true},
          {name : 'Manage', link : './manage', active : false},
          {name : 'ImportData', link : './import-data', active : false},
          {name : 'AnalyzeText', link : './analyze-text', active : false},
        ],
      }
    },

    methods : {
      /**
       * 해당 메뉴로 이동한다.
       * @param menuName
       */
      goMenu : function (menuName) {
        const self = this;
        each(this.menuArray, (value, key, array) => {
          if(value.name === self.$route.name){
            value.active = true;
          }else{
            value.active = false;
          }
        })
      }
    }
  }
</script>

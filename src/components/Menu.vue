<template>
  <!--<div class="menu">-->
    <nav class="navbar  fixed-top navbar-expand-sm bg-light navbar-light">
      <ul class="nav nav-tabs">
          <li div v-for="item in menuArray">
            <router-link :to="item.link" class="nav-link" v-bind:class="{active: item.active}"><div @click="goMenu(item.name)">{{item.name}}</div></router-link>
          </li>
      </ul>
    </nav>
  <!--</div>-->

</template>

<script>
  const each = require('foreach');

  export default {
    name: 'Menu',
    created : function () {
    },
    data () {
      return {
        menuArray: [
          {name : 'Search', link : './', active : true},
          {name : 'Manage', link : './manage', active : false},
        ],
      }
    },
    methods : {
      goMenu : function (menuName) {
        each(this.menuArray, function (value, key, array) {
          if(value.name === menuName){
            value.active = true;
          }else{
            value.active = false;
          }
        })
      }
    }
  }
</script>

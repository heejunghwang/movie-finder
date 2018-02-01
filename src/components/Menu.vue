<template>
  <div class="menu">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <router-link to="./" class="nav-link active">Search</router-link>
      </li>
      <li class="nav-item">
       <router-link to="./manage" class="nav-link disabled">관리</router-link>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
  </div>

</template>

<script>
  export default {
    name: 'Menu'
  }
</script>

<template>
  <div class="main-page">
    <LoginRegister></LoginRegister>
  </div>
</template>

<script>
import Navbar from './Navbar'
import LoginRegister from './LoginRegister'
export default {
  components: {
    Navbar,
    LoginRegister
  },
  name: 'main-page',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Record Collector</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item"><router-link to="/" class="nav-link" v-if="!isSignedin()">Sign in</router-link></li>
        <li class="nav-item"><router-link to="/signup" class="nav-link" v-if="!isSignedin()">Sign up</router-link></li>
        <li class="nav-item"><router-link to="/records" class="nav-link" v-if="isSignedin()">Records</router-link></li>
        <li class="nav-item"><router-link to="/artists" class="nav-link" v-if="isSignedin()">Artists</router-link></li>
        <li class="nav-item"><a href="#" class="nav-link" v-if="isSignedin()" @click.prevent="signout">Sign out</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'Header',
    created () {
      this.isSignedin()
    },
    methods: {
      setError (error, text) {
        this.error = (error.response && error.response.data && error.response.data.error) || text
      },
      isSignedin () {
        return localStorage.signedIn
      },
      signout () {
        this.$http.secured.delete('/signout')
                          .then(() => {
                            delete localStorage.csrf
                            delete localStorage.signedIn
                            this.$router.replace('/')
                          })
                          .catch(err => this.setError(err, 'Failed to sign out'))
      }
    }
  }
</script>
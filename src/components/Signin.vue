<template>
  <div class="container">
    <div class="card mt-5">
      <div class="card-body">
        <h3 class="card-title mb-3">Sign In</h3>
        <form @submit.prevent="signin">
          <div class="text-red" v-if="error">{{ error }}</div>
          <div class="form-group">
            <label for="email">E-mail Address</label>
            <input type="email" v-model="email" class="form-control" id="email" placeholder="email@example.com">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" class="form-control" id="password" placeholder="Enter a secure password">
          </div>
          <button type="submit" class="btn btn-success btn-block mt-4">Sign In</button>
          <div class="mt-2">
            <router-link to="/signup" class="btn btn-link">Sign Up</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Signin',
    data () {
      return {
        email: '',
        password: '',
        error: ''
      }
    },
    created () {
      this.checkSignedIn()
    },
    updated () {
      this.checkSignedIn()
    },
    methods: {
      signin () {
        this.$http.plain.post('/signin', { email: this.email, password: this.password })
                        .then(res => this.signinSuccessful(res))
                        .catch(err => this.signinFailed(err))
      },
      signinSuccessful (response) {
        if (!response.data.csrf) {
          this.signinFailed(response)
          return
        }

        localStorage.csrf = response.data.csrf
        localStorage.signedIn = true
        this.error = ''
        this.$router.replace('/records')
      },
      signinFailed (error) {
        this.error = (error.response && error.response.data && error.response.data.error) || ''
        delete localStorage.csrf
        delete localStorage.signedIn
      },
      checkSignedIn () {
        if (localStorage.signedIn) this.$router.replace('/records')
      }
    }
  }
</script>

<style scoped>
  .card {
    width: 65%;
    margin: auto;
  }
</style>

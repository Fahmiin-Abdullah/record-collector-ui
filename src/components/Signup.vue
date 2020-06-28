<template>
  <div class="container">
    <div class="card mt-5">
      <div class="card-body">
        <h3 class="card-title mb-3">Sign Up</h3>
        <form @submit.prevent="signup">
          <div class="text-red" v-if="error">{{ error }}</div>
          <div class="form-group">
            <label for="email">E-mail Address</label>
            <input type="email" v-model="email" class="form-control" id="email" placeholder="email@example.com">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" class="form-control" id="password" placeholder="Enter a secure password">
          </div>
          <div class="form-group">
            <label for="password_confirmation">Password confirmation</label>
            <input type="password" v-model="password_confirmation" class="form-control" id="password_confirmation" placeholder="Re-enter your password">
          </div>
          <button type="submit" class="btn btn-success btn-block mt-4">Sign Up</button>
          <div class="mt-2">
            <router-link to="/" class="btn btn-link">Sign In</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Signup',
    data () {
      return {
        email: '',
        password: '',
        password_confirmation: '',
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
      signup () {
        this.$http.plain.post('/signup', { email: this.email, password: this.password, password_confirmation: this.password_confirmation })
                        .then(res => this.signupSuccessful(res))
                        .catch(err => this.signupFailed(err))
      },
      signupSuccessful (response) {
        if (!response.data.csrf) {
          this.signupFailed(response)
          return
        }

        localStorage.csrf = response.data.csrf
        localStorage.signedIn = true
        this.error = ''
        this.$router.replace('/records')
      },
      signupFailed (error) {
        this.error = (error.response && error.response.data && error.response.data.error) || 'Something went wrong!'
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

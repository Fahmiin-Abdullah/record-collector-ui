<template>
  <div class="container">
    <div class="card mt-5">
      <div class="card-body">
        <h3 class="card-title mb-3">Add a new artist</h3>
        <form @submit.prevent="addArtist">
          <div class="red-text" v-if="error">{{ error }}</div>
          <div class="form-group">
            <input type="text" v-model="newArtist.name" class="form-control" placeholder="Type an artist name">
          </div>
          <button type="submit" class="btn btn-success btn-block mt-4">Add artist</button>
          <hr>
          <div class="list-group">
            <div class="list-group-item list-group-item-action row" v-for="artist in artists" :key="artist.id" :artist="artist">
              <div class="col-8">
                <a href="#">{{ artist.name }}</a>
              </div>
              <div class="col-4">
                <button class="btn btn-primary" @click.prevent="editArtist(artist)">Edit</button>
                <button class="btn btn-danger" @click.prevent="deleteArtist(artist)">Delete</button>
              </div>
              <div v-if="artist === editedArtist">
                <form @submit.prevent="updateArtist(artist)">
                  <div class="form-group">
                    <input type="text" v-model="artist.name" class="form-control">
                  </div>
                  <button type="submit" class="btn btn-success btn-block mt-4">Update artist</button>
                </form>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Artists',
    data () {
      return {
        artists: [],
        newArtist: {},
        error: '',
        editedArtist: {}
      }
    },
    created () {
      if (!localStorage.signedIn) this.$router.replace('/')
      else {
        this.$http.secured.get('/api/v1/artists')
                          .then(res => this.artists = res.data)
                          .catch(err => this.setError(err, 'Something went wrong...'))
      }
    },
    methods: {
      setError (error, text) {
        this.error = (error.response && error.response.data && error.response.data.error) || text
      },
      addArtist () {
        const value = this.newArtist

        if (!value) return
        else {
          this.$http.secured.post('/api/v1/artists', { artist: { name: this.newArtist.name } })
                            .then(res => {
                              this.artists.push(res.data)
                              this.newArtist = {}
                            })
                            .catch(err => this.setError(err, 'Cannot create artist'))
        }
      },
      deleteArtist (artist) {
        this.$http.secured.delete(`/api/v1/artists/${artist.id}`)
                          .then(() => this.artists.splice(this.artists.indexOf(artist), 1))
                          .catch(err => this.setError(err, 'Cannot delete artist'))
      },
      editArtist (artist) {
        this.editedArtist = artist
      },
      updateArtist (artist) {
        this.editedArtist = {}
        this.$http.secured.patch(`/api/v1/artists/${artist.id}`, { artist: { name: artist.name } })
                          .catch(err => this.setError(err, 'Cannot update artist'))
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

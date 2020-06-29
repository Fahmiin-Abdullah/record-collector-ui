<template>
  <div class="container">
    <div class="card mt-5">
      <div class="card-body">
        <h3 class="card-title mb-3">Add a new record</h3>
        <form @submit.prevent="addRecord">
          <div class="text-red" v-if="error">{{ error }}</div>
          <div class="form-group">
            <input type="text" v-model="newRecord.title" class="form-control" placeholder="Type a record title">
          </div>
          <div class="form-group">
            <input type="text" v-model="newRecord.year" class="form-control" placeholder="Type a record year">
          </div>
          <select class="custom-select" v-model="newRecord.artist">
            <option selected>Select an artist</option>
            <option v-for="artist in artists" :value="artist.id" :key="artist.id">{{ artist.name }}</option>
          </select>
          <p>Don't see an artist? <router-link to="/artists" class="btn btn-link">Create one</router-link>.</p>
          <button type="submit" class="btn btn-success btn-block mt-4">Add record</button>
          <hr>
          <div class="list-group">
            <div class="list-group-item list-group-item-action row" v-for="record in records" :key="record.id" :record="record">
              <div class="col-8">
                <a href="#">{{ record.title }} &mdash; {{ record.year }}</a>
                <small>{{ getArtist(record) }}</small>
              </div>
              <div class="col-4">
                <button class="btn btn-primary" @click.prevent="editRecord(record)">Edit</button>
                <button class="btn btn-danger" @click.prevent="deleteRecord(record)">Delete</button>
              </div>
              <div v-if="record === editedRecord">
                <form @submit.prevent="updateRecord(record)">
                  <div class="form-group">
                    <input type="text" v-model="record.title" class="form-control">
                  </div>
                  <div class="form-group">
                    <input type="text" v-model="record.year" class="form-control">
                  </div>
                  <select class="custom-select" v-model="record.artist">
                    <option selected>Select an artist</option>
                    <option v-for="artist in artists" :value="artist.id" :key="artist.id">{{ artist.name }}</option>
                  </select>
                  <button type="submit" class="btn btn-success btn-block mt-4">Update record</button>
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
    name: 'Records',
    data () {
      return {
        artists: [],
        records: [],
        newRecord: {},
        error: '',
        editedRecord: {}
      }
    },
    created () {
      if (!localStorage.signedIn) this.$router.replace('/')
      else {
        this.$http.secured.get('/api/v1/records')
                          .then(res => this.records = res.data)
                          .catch(err => this.setError(err, 'Something went wrong...'))
        this.$http.secured.get('/api/v1/artists')
                          .then(res => this.artists = res.data)
                          .catch(err => this.setError(err, 'Something went wrong...'))
      }
    },
    methods: {
      setError (error, text) {
        this.error = (error.response && error.response.data && error.response.data.error) || text
      },
      getArtist (record) {
        return this.artists.filter(artist => artist.id === record.artist_id)[0].name
      },
      addRecord () {
        const value = this.newRecord

        if (!value) return
        else {
          this.$http.secured.post('/api/v1/records', { record: { title: this.newRecord.title, year: this.newRecord.year, artist_id: this.newRecord.artist } })
                            .then(res => {
                              this.records.push(res.data)
                              this.newRecord = {}
                            })
                            .catch(err => this.setError(err, 'Cannot create record'))
        }
      },
      deleteRecord (record) {
        this.$http.secured.delete(`/api/v1/records/${record.id}`)
                          .then(() => this.records.splice(this.records.indexOf(record), 1))
                          .catch(err => this.setError(err, 'Cannot delete record'))
      },
      editRecord (record) {
        this.editedRecord = record
      },
      updateRecord (record) {
        this.editedRecord = {}
        this.$http.secured.patch(`/api/v1/records/${record.id}`, { record: { title: record.title, year: record.year, artist_id: record.artist } })
                          .catch(err => this.setError(err, 'Cannot update record'))
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

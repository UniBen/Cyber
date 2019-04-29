<style lang="scss">
  @import "resources/scss/main.scss";
</style>

<template>
  <div id="app">
    <header class="site-header">
      <div class="header__logo">
        <img alt="Vue logo" src="https://www.hud.ac.uk/media/universityofhuddersfield/styleassets/images/2016homepageimages/uoh-logo-2019-white.svg" />
      </div>
    </header>

    <main>
      <div class="container">
        <div class="content">
          <vue-dropzone id="csv-upload" ref="upload" :options="dropOptions"></vue-dropzone>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import vueDropzone from "vue2-dropzone";

export default {
  name: 'app',
  data: () => ({
    dropOptions: {
      url: "http://localhost:3000/upload",
      method: 'post',
      acceptedFiles: '.csv',
      maxFiles: 1,
    }
  }),
  components: {
    vueDropzone
  },
  methods: {
    upload: () => console.log('Uploading file')
  }
}
</script>


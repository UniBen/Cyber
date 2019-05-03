<style lang="scss">
  @import "resources/scss/main.scss";

  .button-group {
    display: inline-block;
    padding: .5rem;
    margin: 0 0 1rem;
    border: 1px solid $lightgrey;
    border-radius: .25rem;

    .btn {
      margin: .25rem;
    }

    &:empty {
      display: none;
    }
  }

  .results {
    width: 100%;
    border-collapse: collapse;
    text-align: center;

    td {
      height: 20px;
      padding: .25rem 0.125rem;
    }
  }
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
        <ParseCSS :range="50"></ParseCSS>

        <div class="content">
          <div class="button-group">
            <button @click="restart" v-if="complete" class="btn">Restart</button>
            <button @click="toggleDifference" v-if="complete" class="btn">Show Difference</button>
          </div>

          <vue-dropzone
            id="csv-upload"
            ref="upload"
            v-if="!complete"
            v-on:vdropzone-complete="uploaded"
            v-on:vdropzone-success="success"
            :options="dropOptions"
          ></vue-dropzone>

          <div v-if="complete" class="results">
            <virtual-list :size="20" :remain="20">
              <tr v-for="(row, index) in items" :key="index">
                <td
                  v-for="(column, index) in row"
                  :data-difference="column.difference"
                  :key="index"
                  :title="!showDifference ? column.difference : column.value">
                    {{ showDifference ? column.difference : column.value }}
                </td>
              </tr>
            </virtual-list>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import vueDropzone from "vue2-dropzone";
  import virtualList from 'vue-virtual-scroll-list';
  import axios from 'axios';
  import ParseCSS from './components/ParseCSS';

  export default {
    name: 'app',
    data: () => ({
      complete: false,
      items: [],
      showDifference: false,
      dropOptions: {
        url: "http://localhost:3000/upload",
        method: 'post',
        acceptedFiles: '.csv',
        maxFiles: 1,
      }
    }),
    components: {
      vueDropzone,
      virtualList,
      ParseCSS,
    },
    methods: {
      uploaded() {
        this.$refs.upload.removeAllFiles()
      },
      success(file, response) {
        axios.get(`http://localhost:3000/get/${response.key}/1`);

        this.complete = true
      },
      toggleDifference() {
        this.showDifference = !this.showDifference;
      },
      restart() {
        Object.assign(this.$data, this.$options.data())
      }
    }
  }
</script>


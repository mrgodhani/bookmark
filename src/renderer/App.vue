<template>
  <v-app>
    <sidebar></sidebar>
    <v-toolbar light fixed>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-text-field prepend-icon="search" label="Search..." hide-details single-line light v-model="search"></v-text-field>
    </v-toolbar>
    <main class="bg">
      <v-container fluid>
        <bookmark-list :type="type" :category="category.name"></bookmark-list>
      </v-container>
      <v-dialog v-model="bookmark" width="500">
        <v-btn floating class="secondary floatingbtn" slot="activator">
          <v-icon light>add</v-icon>
        </v-btn>
        <v-card>
          <v-card-row>
            <v-card-title>Add a New Bookmark</v-card-title>
          </v-card-row>
          <v-card-row>
            <v-card-text>
              <v-text-field label="Bookmark URL" v-model="bookmarklink.link" type="url" required></v-text-field>
              <v-select
                  v-if="$store.state.bookmark.categories.length > 0"
                  v-bind:items="$store.state.bookmark.categories"
                  item-text="name"
                  v-model="bookmarklink.category"
                  label="Select a category"
                  dark
                  single-line
                  auto
                  required
                >
              </v-select>
            </v-card-text>
          </v-card-row>
          <v-card-row actions>
            <v-btn class="secondary--text darken-1" flat="flat" @click.native="bookmark = false">Cancel</v-btn>
            <v-btn class="secondary--text darken-1" flat="flat" @click.native="addBookmark(bookmarklink)">Add</v-btn>
          </v-card-row>
        </v-card>
      </v-dialog>
    </main>
  </v-app>
</template>

<script>
import extract from './helper/fetch'
import _ from 'lodash'

export default {
  name: 'bookmark',
  data () {
    return {
      title: 'All Bookmarks',
      search: null,
      type: 'all',
      bookmark: false,
      link: null,
      category: {
        name: null,
        color: null
      },
      bookmarklink: {
        category: null,
        favicon: null,
        link: null
      }
    }
  },
  created () {
    this.$on('category', function (val) {
      this.type = 'category'
      this.category.name = val
      this.title = _.capitalize(val)
    })
    this.$on('type', function (val) {
      this.type = val
      if (val === 'all') {
        this.title = 'All Bookmarks'
      } else {
        this.title = _.capitalize(val)
      }
    })
    this.$store.dispatch('loadBookmarks', this.$db.ref('bookmarks'))
  },
  methods: {
    addBookmark (data) {
      extract.extractLink(data.link, data.category).then((data) => {
        this.$db.ref('bookmarks').push(data)
        this.bookmark = false
        this.bookmarklink = { title: null, category: null, link: null }
      })
    }
  }
}
</script>

<style lang="stylus">
  @import '../../node_modules/vuetify/src/stylus/settings/_colors'
  $theme := {
    primary: $grey.darken-4
    accent: $red.accent-2
    secondary: $pink.darken-1
    info: $blue.lighten-1
    warning: $amber.darken-2
    error: $red.accent-4
    success: $green.lighten-2
  }
  @import '../../node_modules/vuetify/src/stylus/main'

  .bg
    background: $grey.lighten-4

  .floatingbtn
    position: fixed
    bottom: 20px
    right: 15px
    overflow: hidden
</style>

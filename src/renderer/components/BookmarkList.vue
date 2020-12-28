<template>
  <v-layout row v-if="$store.state.bookmark.bookmarks.length > 0" wrap>
    <v-flex xs12>
      <v-list two-line dense>
        <template v-for="bookmark in filteredBookmarks">
          <v-list-item  style="background:white;" @click="openLink(bookmark.url)">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img :src="bookmark.favicon">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title> {{ bookmark.title }} </v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action v-if="bookmark.favourite">
                <v-icon class="yellow--text yellow--accent-4">grade</v-icon>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-chip :style="{'background': bookmark.category.color, 'color': 'white', 'borderColor': bookmark.category.color}" small>{{ bookmark.category.name }}</v-chip>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-menu bottom left transition="v-slide-y-transition">
                  <v-btn icon="icon" slot="activator">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-item>
                      <v-list-tile @click.native="markFavourite(bookmark)">
                        <v-list-tile-title v-if="!bookmark.favourite">Mark as favourite</v-list-tile-title>
                        <v-list-tile-title v-else>Mark as unfavourite</v-list-tile-title>
                      </v-list-tile>
                    </v-list-item>
                    <v-list-item>
                      <v-list-tile @click.native="deleteBookmark(bookmark)">
                        <v-list-tile-title>Delete</v-list-tile-title>
                      </v-list-tile>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-item>
          <v-divider></v-divider>
        </template>
      </v-list>
    </v-flex>
  </v-layout>
  <v-layout row justify-center v-else>
    <v-flex xs12>
      <p class="text-xs-center">No bookmarks found.</p>
    </v-flex>
  </v-layout>
</template>
<script>
import _ from 'lodash'

const filters = {
  all: bookmarks => bookmarks,
  favourites: bookmarks => bookmarks.filter(bookmark => bookmark.favourite),
  category: (bookmarks, category) => bookmarks.filter(bookmark => bookmark.category.name === category)
}

export default {
  props: {
    type: {
      type: String,
      default: 'all'
    },
    category: {
      type: String,
      default: ''
    }
  },
  computed: {
    bookmarks () {
      return this.$store.state.bookmark.bookmarks
    },
    filteredBookmarks () {
      if (this.type !== 'category') {
        return filters[this.type](this.bookmarks)
      }
      return filters[this.type](this.bookmarks, this.category)
    }
  },
  methods: {
    openLink (url) {
      this.$electron.shell.openExternal(url)
    },
    deleteBookmark (bookmark) {
      this.$db.ref('bookmarks').child(_.get(bookmark, '.key')).remove()
    },
    markFavourite (bookmark) {
      const key = _.get(bookmark, '.key')
      if (bookmark.favourite) {
        this.$db.ref('bookmarks').child(key).update({favourite: false})
      } else {
        this.$db.ref('bookmarks').child(key).update({favourite: true})
      }
    }
  }
}
</script>
<style lang="stylus">
.avatar img
  width: 24px
  height: 24px
</style>

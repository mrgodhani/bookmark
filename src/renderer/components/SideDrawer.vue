<template>
  <v-navigation-drawer permanent light>
    <v-list dense>
      <v-list-item @click="setFeed('all')">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>bookmark</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              All Bookmarks
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-item>
      <v-divider dark></v-divider>
      <v-list-item @click="setFeed('favourites')">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>grade</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Favourites
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-item>
      <v-divider dark></v-divider>
      <v-layout row>
        <v-flex xs6>
          <v-subheader>
            Categories
          </v-subheader>
        </v-flex>
        <v-flex xs6 class="text-xs-right">
          <v-dialog v-model="dialog" width="500">
            <v-btn slot="activator" icon>
              <v-icon>add</v-icon>
            </v-btn>
            <v-card>
              <v-card-row>
                <v-card-title>Add a new category</v-card-title>
              </v-card-row>
              <v-card-row>
                <v-card-text>
                  <v-text-field label="Category Name" v-model="category.name"></v-text-field>
                  <v-select
                  v-bind:items="categoryColors"
                  v-model="category.color"
                  label="Select Color"
                  dark
                  single-line
                  auto
                  ></v-select>
                </v-card-text>
              </v-card-row>
              <v-card-row actions>
                <v-btn class="secondary--text darken-1" flat="flat" @click.native="dialog = false">Cancel</v-btn>
                <v-btn class="secondary--text darken-1" flat="flat" @click.native="addCat(category)">Add</v-btn>
              </v-card-row>
            </v-card>
          </v-dialog>
        </v-flex>
      </v-layout>
      <v-list-item @click="setCategory(category.name)" v-for="category in $store.state.bookmark.categories" v-bind:key="category.name">
        <v-list-tile>
          <v-list-tile-action>
            <v-icon :style="{ color: category.color }">fiber_manual_record</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ category.name }}
            </v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon ripple @click.native="deleteCategory(category)">
              <v-icon class="grey--text text--lighten-1">delete</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import _ from 'lodash'

export default {
  data () {
    return {
      dialog: false,
      categoryColors: [
        'Red', 'Orange', 'Yellow', 'Green',
        'Teal', 'Blue', 'Violet', 'Purple', 'Pink', 'Brown', 'Grey'
      ],
      category: {
        name: null,
        color: null
      }
    }
  },
  created () {
    this.$store.dispatch('loadCategories', this.$db.ref('categories'))
  },
  methods: {
    setCategory (name) {
      this.$parent.$emit('category', name)
    },
    setFeed (type) {
      this.$parent.$emit('type', type)
    },
    addCat (cat) {
      this.$db.ref('categories').push(cat)
      this.dialog = false
      this.category = { name: null, color: null }
    },
    deleteCategory (name) {
      const catKey = _.get(name, '.key') // Get category key
      const catName = _.get(name, 'name') // Get category name
      const bookmarks = _.filter(this.$store.state.bookmark.bookmarks, ['category', catName])
      // Skim through all Bookmarks and remove all links within category
      _.forEach(bookmarks, (value) => {
        this.$db.ref('bookmarks').child(_.get(value, '.key')).remove()
      })
      this.$db.ref('categories').child(catKey).remove() // Remove Category
    }
  }
}
</script>

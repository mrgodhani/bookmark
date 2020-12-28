import Vue from 'vue'
import Sidebar from './SideDrawer'
import BookmarkList from './BookmarkList'

export default {
  registerComponents () {
    Vue.component('sidebar', Sidebar)
    Vue.component('bookmark-list', BookmarkList)
  }
}

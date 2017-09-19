<template>
  <v-app id="example-1" toolbar footer>
    <!--
    <v-navigation-drawer
      persistent
      v-model="drawer"
      light
      enable-resize-watcher
      absolute
    >
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  -->
    <v-toolbar class="indigo" dark fixed>
      <!--
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
-->
      <v-toolbar-title>Practice App</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>

      </v-container>
    </main>
    <v-footer class="indigo">
      <span class="white--text">© 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data () {
      return {
        drawer: false
      }
    }
}
</script>

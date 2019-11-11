<template>
  <v-toolbar
    color="blue"
    dense
    fixed
    clipped-left
    app
  >
    <v-toolbar-side-icon v-on:click="toggleDrawer"></v-toolbar-side-icon>
    <div id="logo">
      <img
        :src="require('../assets/profi-logo.png')"
      />
    </div>
    <v-toolbar-title class="mr-5 align-center">
      <span>  </span>
      <span class="title">RTRS Boilerplate App </span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <UserButton></UserButton>
  </v-toolbar>
</template>

<script>
  import UserButton from './UserButton'

  export default {
    components: {
      UserButton
    },
    props: ['drawer'],
    name: 'ToolBar',
    methods: {
      toggleDrawer: function () {
        this.$emit('toggle-sidebar')
      }
    },
    data: () => ({})
  }
</script>

<style scoped>
</style>

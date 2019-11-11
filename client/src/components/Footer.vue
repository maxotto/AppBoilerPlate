<template>
  <v-footer
    id="core-footer"
    absolute
    height="50"
  >
    <div class="footer-items">
      <span
        v-for="link in links"
        :key="link.name"
      >
        <a
          :href="link.Link"
          class="tertiary--text footer-links">{{ link.name }}</a>
      </span>
    </div>
    <v-spacer/>
    <span class="font-weight-light copyright">
      &copy;
      {{ (new Date()).getFullYear() }}
      <a
        href="https://rtrn.ru/"
        target="_blank">RTRS</a>
    </span>
  </v-footer>
</template>

<script>
  export default {
    name: 'Footer',
    data () {
      return {
        links: [
          { name: this.$t('home'), Link: '/' },
          { name: 'РТРС', Link: 'https://rtrn.ru' }
        ]
      }
    }
  }
</script>

<style scoped>
  #core-footer {
    z-index: 0;
  }
</style>

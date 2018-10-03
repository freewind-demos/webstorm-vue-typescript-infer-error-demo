<template>
  <div id="app">
    <TodoMvc v-bind:currentPath="currentPath"/>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import TodoMvc from './components/TodoMvc.vue';

  @Component({
    components: {
      TodoMvc,
    },
  })
  export default class App extends Vue {
    currentPath: string | null = null;

    mounted() {
      this.onRouteChange(this.$route);
    }

    @Watch('$route')
    onRouteChange(to: {path: string}) {
      this.currentPath = to.path
    }
  }
</script>

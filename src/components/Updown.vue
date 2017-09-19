<template>
  <div><v-btn v-on:click="emit('down')">{{prefix}} Down</v-btn><v-btn  v-on:click="emit('up')">{{prefix}} Up</v-btn ></div>
</template>

<script>
  export default {
    props: ['prefix'],
    methods: {
      emit: function(value) {
        this.$emit(value);
      }
    }
  }
</script>

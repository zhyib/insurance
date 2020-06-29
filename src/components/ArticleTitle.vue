<template>
  <div>
    {{fileName}}
  </div>
</template>

<script>
export default {
  name: "ArticleTitle",
  props: {
    fileN: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      fileName: this.fileN
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <div class="markdown-body">
    <markdown />
  </div>
</template>

<script>
import markdown from '../../assets/articles/2-跨域问题处理.md'
import 'highlight.js/styles/github.css'
import 'github-markdown-css'
import { articleNo } from '../../utils/articleNo'

export default {
  name: "article" + articleNo[2].index,
  components: {
    markdown
  }
}
</script>
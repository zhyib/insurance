<template>
  <div class="markdown-body">
    <markdown />
  </div>
</template>

<script>
import markdown from '../../assets/articles/3-使用Travis和ghpage实现自动部署.md'
import 'highlight.js/styles/github.css'
import 'github-markdown-css'
import { articleNo } from '../../utils/articleNo'

export default {
  name: "article" + articleNo[3].index,
  components: {
    markdown
  }
}
</script>
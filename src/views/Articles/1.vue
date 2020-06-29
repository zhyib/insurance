<template>
  <div class="markdown-body">
    <markdown />
  </div>
</template>

<script>
import markdown from '../../assets/articles/1-引入markdown文件.md'
import 'highlight.js/styles/github.css'
import 'github-markdown-css'
import {articleNo} from "../../utils/articleNo";

export default {
  name: "article" + articleNo[1].index,
  components: {
    markdown
  }
}
</script>
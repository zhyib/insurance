<template>
  <div class="markdown-body">
    <markdown />
  </div>
</template>

<script>
import markdown from '../../assets/articles/0-零号文档.md'
import 'highlight.js/styles/github.css'
import 'github-markdown-css'
import {articleNo} from "../../utils/articleNo";

export default {
  name: "article" + articleNo[0].index,
  components: {
    markdown
  }
}
</script>
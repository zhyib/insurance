<template>
  <div id="whole-page">
    <div v-if="!returnCookie()">
      <router-view></router-view>
    </div>
    <div v-if="returnCookie()" id="main-box">
      <div id="main-left">
        <div id="side-box">
          <div id="side-top">
            <div @click="getHome()" style="cursor: pointer">WE DO SECURE</div>
          </div>
          <div id="side-center">
            <div class="article-type">
              <el-link type="info" :underline="false" @click="changeType('home')">Home Insurance</el-link>
            </div>
            <div class="article-type">
              <el-link type="info" :underline="false" @click="changeType('automobile')">Automobile Insurance</el-link>
            </div>
          </div>
          <div id="side-bottom">
            <el-link type="info" :underline="false" @click="logOut()">LOG OUT</el-link>
          </div>
        </div>
      </div>
      <div id="main-center">
        <el-divider content-position="left">Pages</el-divider>
        <div id="title-area">
          <div v-if="type === 'home'">
            <div class="block">
              <el-link type="info" :underline="false" @click="pushPath('/home-insurance/insurance')">Home Insurance
              </el-link>
            </div>
            <div class="block">
              <el-link type="info" :underline="false" @click="pushPath('/home-insurance/home')">Home Details</el-link>
            </div>
            <div class="block">
              <el-link type="info" :underline="false" @click="pushPath('/home-insurance/invoice')">Invoice
              </el-link>
            </div>
            <div class="block">
              <el-link type="info" :underline="false" @click="pushPath('/home-insurance/payment')">Payment
              </el-link>
            </div>
          </div>
          <div v-if="type === 'automobile'">
            <div class="block">
              <el-link type="info" :underline="false" @click="pushPath('/automobile-insurance/insurance')">
                Automobile Insurance
              </el-link>
            </div>
            <div class="block">
              <el-link type="info" :underline="false" @click="pushPath('/automobile-insurance/automobile')">
                Automobile Details
              </el-link>
            </div>
            <div class="block">
              <el-link type="info" :underline="false" @click="pushPath('/automobile-insurance/driver')">
                Driver
              </el-link>
            </div>
            <div class="block">
              <el-link type="info" :underline="false" @click="pushPath('/automobile-insurance/invoice')">
                Invoice
              </el-link>
            </div>
            <div class="block">
              <el-link type="info" :underline="false" @click="pushPath('/automobile-insurance/payment')">
                Payment
              </el-link>
            </div>
          </div>
        </div>
      </div>
      <div id="main-right">
        <div id="article-area">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  html, body {
    margin: 0 0 0 0;
    font-family: Arial, sans-serif;
    height: 100%;
  }

  #whole-page {
    height: 100%;
  }

  #main-box {
    display: flex;
    height: 100%;
  }

  #main-left {
    width: 250px;
    color: white;
    background-color: #303133;
    height: 100%;
  }

  #side-box {
    display: flex;
    height: 100%;
    align-items: center;
    flex-direction: column;
  }

  #side-top {
    padding-top: 30px;
    height: 50px;
  }

  #side-center {
    flex: auto;
  }

  .article-type {
    margin: 20px 0 20px 0;
  }

  #side-bottom {
    height: 50px;
  }

  #main-center {
    height: 100%;
    background-color: #EBEEF5;
    width: 200px;
  }

  .el-divider__text {
    background-color: #EBEEF5 !important;
  }

  .article-title {
    cursor: pointer
  }

  #main-right {
    width: 1000px;
    height: 100%;
    overflow-y: auto;
    flex: 1;
  }

  #article-area {
    padding: 30px 30px 30px 30px;
  }

  .block {
    margin: 30px 0 0 20px;
  }
</style>

<script>

import { articleNo } from "./utils/articleNo";

export default {
  data() {
    return {
      articleNo: articleNo,
      type: 'home',
      login: this.returnCookie()
    }
  },
  computed: {
    reverseArticleNo() {
      let ret = [];
      for (let i = articleNo.length - 1; i >= 0; i--) {
        if (articleNo[i].type === this.type) {
          ret.push(articleNo[i]);
        }
      }
      return ret;
    }
  },
  methods: {
    getArticle(index) {
      if (this.$route.name !== ('article' + index)) {
        this.$router.push({
          path: '/article/' + index
        });
      }
    },
    getHome() {
      if (this.$route.name !== 'Home') {
        this.$router.push('/');
      }
    },
    changeType(type) {
      this.type = type;
    },
    pushPath(path) {
      this.$router.push(path);
    },
    returnCookie() {
      if (this.$cookies.get('user_cookie') === "true") {
        return true;
      } else {
        return false;
      }
    },
    logOut() {
      this.$cookies.set("user_cookie","false","1d");
      this.$cookies.set("c_id","-1","1d");
      this.$cookies.set("user_role","-1","1d");
      this.$router.push({ path: '/login' });
    }
  }
}

</script>
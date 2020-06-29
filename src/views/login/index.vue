<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">WE DO SECURE</h3>
      </div>

      <el-form-item label="Username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item label="Password">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button type="primary" plain style="width:100%;margin-bottom:30px;" @click="handleSign()">Sign Up</el-button>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                 @click.native.prevent="handleLogin">Log in
      </el-button>
    </el-form>

    <el-dialog
      title="Sign Up"
      :visible.sync="editbox"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="150px" class="form">
        <el-form-item label="Username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.userPwd" />
        </el-form-item>
        <el-form-item label="Customer ID">
          <el-input v-model="form.customerId" />
        </el-form-item>
        <el-form-item label="Last Name">
          <el-input v-model="form.lastName" />
        </el-form-item>
        <el-form-item label="First Name">
          <el-input v-model="form.firstName" />
        </el-form-item>
        <el-form-item label="Address">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="City">
          <el-input v-model="form.city" />
        </el-form-item>
        <el-form-item label="State">
          <el-select v-model="form.state" placeholder="Select State">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Zip Code">
          <el-input v-model="form.zipcode" />
        </el-form-item>
        <el-form-item label="Gender">
          <el-select v-model="form.gender" placeholder="Select Gender">
            <el-option
              v-for="item in genders"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Martial">
          <el-select v-model="form.martial" placeholder="Select Martial">
            <el-option
              v-for="item in martials"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Customer Type">
          <el-select v-model="form.customerType" placeholder="Select Type">
            <el-option
              v-for="item in types"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div align="right">
          <el-button type="primary" @click="onSubmit">Submit</el-button>
          <el-button @click="onCancel">Cancel</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate';
import { md5 } from '@/utils/encrypt';
import axios from 'axios';
import { user, request, customer } from '@/utils/global';

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      form: {
        // username: '',
        // userPwd: '',
        // customerId: '',
        // lastName: '',
        // firstName: '',
        // address: '',
        // state: '',
        // city: '',
        // zipcode: '',
        // gender: '',
        // martial: '',
        // customerType: '',
        username: '',
        userPwd: '',
        customerId: '',
        lastName: '',
        firstName: '',
        address: '',
        state: '',
        city: '',
        zipcode: '',
        gender: '',
        martial: '',
        customerType: '',
      },
      editbox: false,
      options: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
        'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
        'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'ST', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',],
      genders: [
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' },
      ],
      martials: [
        { value: 'S', label: 'Single' },
        { value: 'M', label: 'Married' },
        { value: 'W', label: 'Widow/Widower' }
      ],
      types: [
        { value: 'A', label: 'Automobile Insurance' },
        { value: 'H', label: 'Home Insurance' },
        { value: 'B', label: 'Both' }
      ],
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleSign() {
      this.editbox = true;
    },
    handleLogin() {
      this.loading = true;
      console.log(this.loginForm);
      console.log(md5(this.loginForm.password));
      const param = new URLSearchParams();
      param.append('username', this.loginForm.username);
      param.append('password', md5(this.loginForm.password));
      axios
        .post(request(user.login) + this.loginForm.username, param)
        .then((response) => {
          console.log(response.data);
          this.successHandle(response)
        })
        .catch((error) => {
          console.log(error);
          this.errorHandle(error);
        });

    },
    successHandle(response) {
      console.log("SUCCESS")
      if (response.data.data === null) {
        this.$message.error(response.data.msg);
      } else {
        let text;
        if (response.data.data.userRole === 1) {
          text = 'admin'
        } else {
          text = 'customer'
        }
        this.$cookies.set("user_cookie", 'true', "1d");
        this.$cookies.set("user_role", text, "1d");
        this.$cookies.set("c_id", response.data.data.customerId, "1d");
        this.$router.push({ path: '/' });
      }
      this.loading = false;
    },
    errorHandle(error) {
      console.log(error.toString());
      this.$message.error('Invalid Login');
      this.loading = false;
    },
    onSubmit() {
      console.log(this.form);
      const param = new URLSearchParams();
      param.append('customerId', this.form.customerId);
      param.append('lastName', this.form.lastName);
      param.append('firstName', this.form.firstName);
      param.append('address', this.form.address);
      param.append('state', this.form.state);
      param.append('city', this.form.city);
      param.append('zipcode', this.form.zipcode);
      param.append('gender', this.form.gender);
      param.append('martial', this.form.martial);
      param.append('customerType', this.form.customerType);
      axios
        .post(request(customer.add), param)
        .then((response) => {
          console.log(response);
          if (response.data.code === 0) {
            this.$message.success('Submitted');
            this.editbox = false;
          } else if (response.data.code === -1) {
            this.$message.error('An error occurred');
          } else {
            this.$message.error(response.data.msg);
          }
        })
        .catch((error) => {
          console.log(error.toString());
          this.$message.error(error.toString());
        });
      const param2 = new URLSearchParams();
      param2.append('userId', this.form.customerId);
      param2.append('username', this.form.username);
      param2.append('userPwd', md5(this.form.userPwd));
      param2.append('userRole', '2');
      param2.append('customerId', this.form.customerId);
      axios
        .post(request(user.add), param2)
        .then((response) => {
          console.log(response);
          if (response.data.code === 0) {
            this.$message.success('Submitted');
            this.editbox = false;
          } else if (response.data.code === -1) {
            this.$message.error('An error occurred');
          } else {
            this.$message.error(response.data.msg);
          }
        })
        .catch((error) => {
          console.log(error.toString());
          this.$message.error(error.toString());
        });
    },
    onCancel() {
      this.editbox = false;
      this.dialogVisible = false;
      this.$message('Cancelled');
    },
  }
};
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 80%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #999999;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
      padding-left: 15px;
      padding-top: 5px;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    height: 100%;
    position: absolute;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
<style scoped>
  .el-button {
    margin-left: 0 !important;
    margin-bottom: 20px !important;
  }

  .el-input__inner {
    color: #889aa4 !important;
  }

  .el-form-item {
    /*background-color: #eeeeee !important;*/
  }

  .el-form-item__content {
    margin-left: 20px !important;
  }

</style>

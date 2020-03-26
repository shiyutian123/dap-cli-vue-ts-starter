<template>
  <div class="container">
    <div class="login-form-wrap">
      <div class="login-form-header">
        <h2>登录</h2>
      </div>
      <a-form @submit="onSubmit" :form="loginform">
        <a-form-item>
          <a-input
            v-decorator="[
              'userName',
              { rules: [{ required: true, message: '请输入账号!' }] }
            ]"
            size="large"
            placeholder="账户"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入密码!' }] }
            ]"
            size="large"
            placeholder="密码"
            type="password"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :loading="logging"
            :block="true"
            size="large"
            htmlType="submit"
            type="primary"
            >登录</a-button
          >
        </a-form-item>
        <div>
          <a-checkbox :checked="true">记住密码</a-checkbox>
          <a style="float: right">忘记密码?</a>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Watch } from 'vue-property-decorator'
import Component from 'vue-class-component'
import apis from '@/api'
import { Mutation, namespace } from 'vuex-class'
import { RESET_APP_INFO } from '@/store/appInfo.store.ts'
import { SET_TOKEN, RESET_AUTH_STORE } from '@/store/auth.store.ts'

const appInfoModule = namespace('appInfoModule')
const authModule = namespace('authModule')

@Component
export default class Login extends Vue {
  name: 'Login';

  private logging = false;
  private loginform: any;

  @authModule.Mutation(SET_TOKEN) setToken: any;
  @authModule.Mutation(RESET_AUTH_STORE) resetAuthStore: any;
  @appInfoModule.Mutation(RESET_APP_INFO) resetAppInfo: any;

  created () {
    this.loginform = this.$form.createForm(this)
    this.resetAppInfo()
    this.resetAuthStore()
  }

  onSubmit (e) {
    e.preventDefault()
    this.loginform.validateFields((errors, formData) => {
      console.log(errors, formData)
      if (!errors && formData.userName && formData.password) {
        const LOGIN = {
          url: apis.LOCAL_LOGIN,
          method: 'post',
          params: {
            empId: formData.userName,
            password: formData.password
          }
        }
        this.logging = true;
        (this as any).$request(LOGIN)
          .aysncThen(
            resp => {
              console.log(resp)
              if (resp.code === 'ok') {
                const token = resp.data.accessToken || '';
                (Vue as any).addHeaders({
                  AuthorizationToken: token
                })
                this.setToken({
                  token: token,
                  expire: 60 * 60 * 1000 * 24 * 7
                })
                this.logging = false
                this.$router.push('/BasicLayout/welcome')
              }
            },
            businessError => {
              this.logging = false
              this.$notification.error({
                message: '错误',
                description: businessError.message
              })
            }
          )
          .aysncErrorCatch(error => {
            // 网络请求非业务报错
            console.error(error)
          })
      }
    })
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>

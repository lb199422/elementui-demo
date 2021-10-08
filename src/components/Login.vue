<template>
  <div class="login">
    <div class="container">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="ruleForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="ruleForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="fromReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>



<script>
import { myRequest } from "@/network/request.js";
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 重置表单
    fromReset() {
      this.$refs.ruleForm.resetFields();
    },
    //登录
    login() {
      // 线进行验证
      this.$refs.ruleForm.validate((validate) => {
        if (!validate) return;
        myRequest({
          url: "login",
          method: "POST",
          data: this.ruleForm,
        }).then((res) => {
          console.log(res.data);
          // 根据状态码判断登录是否成功
          if(res.data.meta.status !== 200) {
            this.$message.error('登录失败')
          }else{
            this.$message.success('登录成功')
            // 保存token
            let token = res.data.data.token
            window.sessionStorage.setItem('token', token)
            this.$router.push('/home')
          }
        });
      });
    },
  },
};
</script>



<style scoped lang="less">
.login {
  height: 100%;
  background-color: #2b4b6b;
  .container {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -225px;
    margin-top: -150px;
    .demo-ruleForm {
      position: relative;
      top: 100px;
      padding: 0 20px;
    }
  }
}
</style>
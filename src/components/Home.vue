<template>
  <div class="home">
    <el-container class="home-container">
      <el-header>
        <h2>管理信息系统</h2>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside :width="isCollapse ? '64px': '200px'">
          <!-- 收缩列表 -->
          <div class="toggle-button" @click="toggleClick">|||</div>
          <!-- 左侧菜单 -->
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EFF"
            :collapse-transition="false" 
            :collapse="isCollapse" 
            router
          > 
          <!-- 一级导航  index 必须是字符串 -->
            <el-submenu :index="item.order + '' " v-for="item in menuList" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级导航 -->
              <el-menu-item :index="'/'+subItem.path + ''" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>



<script>
import {myRequest} from '../network/request'
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      isCollapse: false
    };
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 退出
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    // 获取MenuList
    getMenuList() {
      myRequest({
        url: 'menus'
      }).then(res => {
        // console.log(res);
        // 判断是否获取信息成功
        if(res.data.meta.status !== 200) {
          this.$message.error(res.data.meta.msg)
        }else{
          this.menuList = res.data.data
        }
      })
    },
    toggleClick() {
      this.isCollapse = !this.isCollapse
    }
  },
}
</script>



<style scoped lang="less">
.home {
  height: 100%;
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
  }
  .el-aside {
    background-color: #333744;
    .toggle-button{
      color: #fff;
      font-size: 10px;
      line-height: 24px;
      cursor: pointer;
      letter-spacing: 0.2em;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  .el-menu{
    border-right: none;
  }
}
</style>
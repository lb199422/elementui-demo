<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
        <el-table-column label="路径" prop="path" align="center"></el-table-column>
        <el-table-column label="权限等级" prop="level" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="info" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>



<script>
import { myRequest } from '../../network/request'
  export default {
    name: "Rights",
    data() {
      return {
        // 权限列表
        rightsList: []
      }
    },
    created() {
      // 获取权限列表
      this.getRightsList()
    },
    methods: {
      // 获取权限列表
      getRightsList() {
        myRequest({
          url: 'rights/list'
        }).then(res => {
          console.log(res)
          if(res.data.meta.status === 200) {
            this.rightsList = res.data.data;
          }else{
            this.$message.error('获取信息失败')
          }
        })
      },
      
    }
  }
</script>



<style scoped lang="less">
  .el-card{
    margin-top: 20px;
  }
</style>
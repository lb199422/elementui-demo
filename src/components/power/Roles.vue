<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容  -->
    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button type="primary" size="medium">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand" align="center">
          <template slot-scope="scope">
            <!-- 一级分类 -->
            <el-row
              v-for="item in scope.row.children"
              :key="item.id"
              class="permission-row"
            >
              <el-col :span="6"
                ><el-tag closable @close="removeRight(scope.row, item.id)">{{ item.authName }}</el-tag
                ><i class="el-icon-caret-right"></i
              ></el-col>
              <!-- 二三级权限 -->
              <el-col :span="18">
                <el-row
                  :gutter="10"
                  v-for="subitem in item.children"
                  :key="subitem.id"
                  class="sub-permission-row"
                >
                  <el-col :span="6"
                    ><el-tag type="success" closable @close="removeRight(scope.row, subitem.id)">{{
                      subitem.authName
                    }}</el-tag
                    ><i class="el-icon-caret-right"></i
                  ></el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="itemicon in subitem.children"
                      :key="itemicon.id"
                      closable
                      @close="removeRight(scope.row, itemicon.id)"
                    >
                      {{ itemicon.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- slot-scope="scope" -->
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <!-- 分配角色 -->
            <el-button type="warning" 
              icon="el-icon-setting" 
              size="mini"
              @click="showSetRightDialog(scope.row)">
              分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="50%"
      @close="setRightDialogClose"
      >
      <!-- 树形控件 -->
      <el-tree :data="rightsList" 
        :props="defaultProps" 
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        ref="rightTree"
        ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
import { myRequest } from "../../network/request";
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      //分配权限对话框
      dialogVisible: false,
      // 所有权限
      rightsList: [],
      // 树形控件结构
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中
      defaultCheckedKeys: [],
      // 当前roleId
      roleId: ''
    }
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表数据
    getRolesList() {
      myRequest({
        url: "roles",
      }).then((res) => {
        console.log(res);
        if (res.data.meta.status === 200) {
          this.rolesList = res.data.data;
        } else {
          this.$message.error("获取信息失败");
        }
      });
    },
    // 删除权限
    removeRight(role, rightId) {
      // console.log(roleId)
      // console.log(rightId)
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          console.log(res);
          if (res === "confirm") {
            myRequest({
              url: `roles/${role.id}/rights/${rightId}`,
              method: "Delete",
            }).then((res) => {
              console.log(res);
              if (res.data.meta.status === 200) {
                // 将返回值赋值给当前行
                role.children = res.data.data
                this.$message.success(res.data.meta.msg);
              } else {
                this.$message.error("删除权限失败");
              }
            });
          }
        })
        .catch((err) => {
          if (err === "cancel") this.$message.info("取消删除");
        });
    },
    // 显示分配权限对话框
    showSetRightDialog(role) {
      this.dialogVisible = true
      this.roleId = role.id
      // 获取所有权限
      myRequest({
        url: 'rights/tree'
      }).then(res => {
        console.log(res)
        if(res.data.meta.status == 200) {
          this.rightsList = res.data.data
          this.$message.success(res.data.meta.msg)
          // 获取默认选取数据
          this.getDefaultCheckedKeys(role, this.defaultCheckedKeys)
        }else{
          this.$message.error('获取信息失败')
        }
      })
    },
    // 递归获取默认选中的数据 只获取最内层
    getDefaultCheckedKeys(node, arr){
      if(!node.children){
        arr.push(node.id)
        return arr
      }else{
        node.children.forEach(item => this.getDefaultCheckedKeys(item, arr))
      }
    },
    // 关闭 设置权限的dialog
    setRightDialogClose() {
      // 关闭dialog清空数组 避免数组数据越来越多
      this.defaultCheckedKeys = []
    },
    // 分配权限 像服务器提交数据
    allotRight() {
      // 获取提交参数
      console.log(1)
      let keys = [...this.$refs.rightTree.getHalfCheckedKeys(), ...this.$refs.rightTree.getCheckedKeys()]
      console.log(keys)
      // 转字符串
      let str = keys.join(',')
      // 发送请求 提交到数据库中
      myRequest({
        url: `roles/${this.roleId}/rights`,
        method: 'POST',
        data: {
          rids: str
        }
      }).then(res => {
        console.log(res)
        if(res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
          this.dialogVisible = false;
          this.getRolesList()
        }else{
          this.$message.error('跟新失败')
        }
      })
    }
  },
};
</script>



<style scoped lang="less">
.el-card {
  margin-top: 20px;
  .el-table {
    margin-top: 20px;
    // 权限行边框
    .permission-row {
      border-top: 1px solid #eee;
      display: flex;
      align-items: center;
      .sub-permission-row {
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
  .el-tag {
    margin: 10px;
  }
}
</style>
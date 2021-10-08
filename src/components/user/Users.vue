<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索添加 -->
      <el-row :gutter="10">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchClick"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户 -->
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#" align="center">
        </el-table-column>
        <el-table-column prop="username" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" align="center">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" align="center">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" align="center">
          <!-- 拿到当前行数据 -->
          <template slot-scope="scope">
            <!-- {{scope}} -->
            <!-- 开关 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchChage(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- 修改用户信息 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除用户 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 按钮提示 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%"
      @close="dialogClose"
    >
      <!-- <span>添加用户</span> -->
      <!-- 添加用户表单 -->
      <el-form
        :model="addForm"
        :rules="addFromRules"
        ref="addFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息dialog -->
    <el-dialog title="修改用户信息" :visible.sync="editDialog" width="30%">
      <!-- <span>这是一段信息</span> -->

      <!-- 修改用户信息表单 -->
      <el-form
        :model="editFormInfo"
        :rules="addFromRules"
        ref="editForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editFormInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFormInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFormInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改表单信息按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="reviseUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
import { myRequest } from "@/network/request.js";
export default {
  name: "Users",
  data() {
    // 验证邮箱
    var checkEmail = (rule, value, cb) => {
      const resEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (resEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的邮箱地址"));
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    return {
      userList: [],
      // 请求参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      total: 0,
      // 是否显示对话框
      dialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFromRules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 是否显示修改用户信息dialog
      editDialog: false,
      // 修改用户信息表单信息
      editFormInfo: {},
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表数据
    getUserList() {
      myRequest({
        url: "users",
        params: this.queryInfo,
      }).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.error("获取信息失败");
        }
        this.userList = res.data.data.users;
        // 总共多少条数据
        this.total = res.data.data.total;
      });
    },
    // 监听每页几条数据函数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      //根据每页显示条数变化发送请求
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    // 监听页面值变化
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      // 根据页码变化发送请求
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    // 监听switch 事件
    switchChage(switchInfo) {
      console.log(switchInfo);
      // 拿到当前数据变化 去修改数据库中数据
      myRequest({
        url: `users/${switchInfo.id}/state/${switchInfo.mg_state}`,
        method: "PUT",
      }).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          this.$message.error("更新数据失败");
          //更新失败 修改回原来的数据
          switchInfo.mg_state = !switchInfo.mg_state;
        } else {
          this.$message.success(res.data.meta.msg);
        }
      });
    },
    // 搜索
    searchClick() {
      this.getUserList();
    },
    // 关闭添加窗口  清空内容
    dialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户 先判断是否符合规则 然后发送请求
    addUsers() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          myRequest({
            url: "users",
            method: "POST",
            data: this.addForm,
          }).then((res) => {
            console.log(res);
            if (res.data.meta.status !== 201) {
              this.$message.error("添加用户失败");
            } else {
              this.$message.success(res.data.meta.msg);
              this.dialogVisible = false;
              this.getUserList()
            }
          });
        }
      });
    },
    // 显示修改用户信息对话框
    showEditDialog(id) {
      // 根据id发送请求
      myRequest({
        url: `users/${id}`,
      }).then((res) => {
        // console.log(res)
        if (res.data.meta.status !== 200) {
          this.$message.error("查询信息失败");
        } else {
          this.editFormInfo = res.data.data;
        }
      });
      this.editDialog = true;
    },
    // 发送请求修改用户信息
    reviseUserInfo() {
      this.$refs.editForm.validate(valida => {
        if(valida) {
          myRequest({
            url: `users/${this.editFormInfo.id}`,
            method: 'PUT',
            data: {
              email: this.editFormInfo.email,
              mobile: this.editFormInfo.mobile
            }
          }).then(res => {
            console.log(res);
            if(res.data.meta.status !== 200) {
              this.$message.error('修改数据失败')
            }else{
              // 提示修改成功 隐藏 dialog 重新请求用户列表
              this.$message.success(res.data.meta.msg)
              this.editDialog = false
              this.getUserList()
            }
          })
        }
      })
    },
    // 删除用户
    deleteUser(id) {
      console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          // 确认 和取消分别使用then catch 获得参数
        }).then((res) => {
          console.log(res)
          if(res === 'confirm') {
            //发送请求删除数据库中信息
            myRequest({
              url: `users/${id}`,
              method: 'DELETE'
            }).then(res => {
              console.log(res)
              if(res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                // 重新获取用户列表
                this.getUserList()
              }else{
                this.$message.error('删除失败')
              }
            })
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('已经取消删除')
        })
    }
  },
};
</script>



<style scoped lang="less">
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
  font-size: 14px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
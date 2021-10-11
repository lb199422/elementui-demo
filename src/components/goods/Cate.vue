<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  -->
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-row>
        <el-col :span="2"><el-button type="primary" @click="addCateDialog">添加分类</el-button></el-col>
      </el-row>
      <table-tree 
          :data="cateList" 
          :columns="columns"
          :selection-type="false"
          :show-index="true"
          :expand-type="false"
          border
          class="table-tree"
          >
        <!-- 自定义插槽 -->
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted ===false" class="el-icon-success" style="color: lightgreen"></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <!-- 自定义插槽排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level ===0" type="primary">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level ===1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作自定义插槽  编辑删除-->
        <template slot="opt" >
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </table-tree>
      <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPages">
        </el-pagination>
    </el-card>
    <!-- 添加分类弹出框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
      >
      <!-- 添加分类表单 -->
      <el-form ref="addCateForm" 
        :model="addCateForm" 
        label-width="80px" 
        :rules="addCateFormRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类 -->
        <el-form-item label="父级分类">
          <!-- 级联选择框 -->
          <el-cascader
            v-model="parentCateSelectVal"
            :options="parentCateList"
            @change="parentCateHandleChange"
            :props="cascaderProps"
            :clearable="true"
            
            >
            
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
import { myRequest } from '../../network/request'
  export default {
    name: "Cate",
    data() {
      return {
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        // 分类列表
        cateList: [],
        // 总页数
        totalPages: 1,
        // 表格列
        columns: [
          {
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            // 将当前列自定义模板列
            type: 'template',
            // 指定模板名称
            template: 'isok'
          },
          {
            label: '排序',
            // 将当前列自定义模板列
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            // 将当前列自定义模板列
            type: 'template',
            template: 'opt'
          },
        ],
        //添加分类dialog
        addCateDialogVisible: false,
        //添加分类表单数据
        addCateForm: {
          // 分类名称
          cat_name: '',
          // 夫分类id
          cat_pid: 0,
          // 分类等级， 默认添加一级分类
          cat_level: 0

        },
        // 表单验证
        addCateFormRules: {
          cat_name: [
            {required: true, message:'请输入分类名称', trigger: 'blur'}
          ]
        },
        // 父级分类列表
        parentCateList: [],
        // 级联选择框选中的值
        parentCateSelectVal: [],
        // 级联选择器配置
        cascaderProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
          //允许子选择一级选项
          checkStrictly: true
        }
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      // 获取商品分类信息
      getCateList() {
        myRequest({
          url: 'categories',
          params: this.queryInfo
        }).then(res => {
          console.log(res)
          if(res.data.meta.status === 200) {
            this.cateList = res.data.data.result
            this.totalPages = res.data.data.total
          }else{
            this.$message.error('获取商品分类失败')
          }
        })
      },
      //每页条数变化函数
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      // 当前页改变
      handleCurrentChange(newNum) {
        this.queryInfo.pagenum = newNum
        this.getCateList()
      },
      //添加分类 弹出dialog 对话框
      addCateDialog() {
        // 获取父级分类列表
        this.getParentCateList()
        this.addCateDialogVisible = true
      },
      // 获取父级分类的数据列表
      getParentCateList() {
        myRequest({
          url: 'categories',
          params: {
            type: 2
          }
        }).then(res => {
            // console.log(res)
            if(res.data.meta.status === 200) {
              this.parentCateList = res.data.data
              // console.log(this.parentCateList)
            }else{
              this.$message.error('获取父级分类列表失败')
            }
          })
      },
      // 级联选择框值发生变化
      parentCateHandleChange() {
        // console.log(this.parentCateSelectVal)
        // 根据级联选择器值的长度判断选中的父级分类是几级
        if(this.parentCateSelectVal.length > 0) {
          this.addCateForm.cat_pid = this.parentCateSelectVal[this.parentCateSelectVal.length-1]
          this.addCateForm.cat_level = this.parentCateSelectVal.length
          // console.log(this.addCateForm)
        }else{
          this.addCateForm.cat_level = 0
          this.addCateForm.cat_pid = 0
        }
      },
      // 添加分类 dialog 关闭事件 清空表单数据 和级联选择框的数据
      addCateDialogClose() {
        this.$refs.addCateForm.resetFields()
        this.parentCateSelectVal = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      },
      // 添加分类到 服务器
      addGoodsCate() {
        myRequest({
          url: 'categories',
          method: 'POST',
          data: this.addCateForm
        }).then(res => {
          console.log(res)
          if(res.data.meta.status === 201) {
            this.$message.success(res.data.meta.msg)
            this.addCateDialogVisible = false
            this.getCateList()
          }else{
            this.$message.error('添加分类失败')
          }
        })
      }
    }
  }
</script>



<style scoped lang="less">
  .el-card{
    margin-top: 20px;
  }
  .table-tree{
    margin-top: 20px;
  }
</style>
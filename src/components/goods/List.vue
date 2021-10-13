<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片区 -->
  <el-card>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" 
      v-model="queryInfo.query"
      style="width: 300px" 
      clearable
      @clear="getGoodsList"
      class="input-with-select">
      <el-button slot="append" 
        icon="el-icon-search" 
        @click="getGoodsList"></el-button>
    </el-input>
    <!-- 添加商品按钮 -->
    <el-button type="primary" @click="goAddPage">添加商品</el-button>
    <!-- 表格 -->
    <el-table
      :data="goodsList"
      border
      stripe
      style="width: 100%">
      <el-table-column type="index" label="#" align="center"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="80px" align="center"></el-table-column>
      <el-table-column prop="goods_number" label="商品数量" width="80px" align="center"></el-table-column>
      <el-table-column prop="upd_time" label="创建时间" width="180px" align="center">
        <template slot-scope="scope">
          {{scope.row.upd_time | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140px" align="center">
        <!-- 编辑删除按钮 -->
        <template slot-scope="scope">
          <el-button type="primary" 
            icon="el-icon-edit" 
            size="mini">
          </el-button>
          <el-button type="danger" 
            icon="el-icon-delete" 
            size="mini"
            @click="removeById(scope.row.goods_id)"
            >
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 15, 20, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  </div>
</template>



<script>
  import {myRequest} from '@/network/request.js'
  import {format} from '@/utils/index.js'
  export default {
    name: "List",
    data() {
      return {
        goodsList: [],
        //请求参数
        queryInfo: {
          query:'',
          pagenum: 1,
          pagesize: 10
        },
        //总共条数
        total: 0,
      }
    },
    filters: {
      // 时间过滤器
      timeFormat(time) {
        return format(time)
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      // 获取商品列表
      getGoodsList() {
        myRequest({
          url: 'goods',
          params: this.queryInfo
        }).then(res => {
          console.log(res)
          if(res.data.meta.status === 200) {
            this.goodsList = res.data.data.goods
            this.total = res.data.data.total
          }else{
            this.$message.error('获取商品列表失败')
          }
        })
      },
      // 分页每页显示个数变化函数
      handleSizeChange(newpagesize) {
        this.queryInfo.pagesize = newpagesize
        this.getGoodsList()
      },
      // 分页当前页码变化函数
      handleCurrentChange(newpagenum) {
        console.log(1)
        this.queryInfo.pagenum = newpagenum
        this.getGoodsList()
      },
      // 通过id删除商品
      removeById(id) {
        this.$confirm('将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确认删除商品发送请求删除商品
          myRequest({
            url: `goods/${id}`,
            method: 'delete'
          }).then(res => {
            console.log(res);
            if(res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
            }else{
              this.$message.error('删除商品失败')
            }
          })
        }).catch(() => {
          this.$message.info('已取消删除商品')
        })
      },
      // 跳转到添加商品页
      goAddPage() {
        this.$router.push('/goods/add')
      }
    }
  }
</script>



<style scoped lang="less">
  .el-breadcrumb{
    font-size: 14px;
    margin-bottom: 20px;
  }
  .el-input{
    margin-right: 20px;
    margin-bottom: 20px;
  }
</style>
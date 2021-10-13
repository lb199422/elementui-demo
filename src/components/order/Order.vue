<template>
  <div>
    <!-- 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
  <!-- el-card 卡片视图-->
    <el-card>
      <!-- 搜索框 -->
      <el-input placeholder="请输入内容" v-model="searchInput" style="width:400px">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <!-- 表格 -->
      <el-table
        :data="orderList"
        border
        style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="点单编号" align="center"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" align="center"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" align="center"></el-table-column>
        <el-table-column prop="is_send" label="是否发货" align="center"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <!-- 修改 -->
          <template slot-scope="scope">
            <el-button type="primary" 
            size="mini" 
            @click="showEditor(scope.row)"
            icon="el-icon-edit">
          </el-button>
          <el-button type="success" 
            size="mini"
            @click="showLogisticsDialog"
            icon="el-icon-location-outline">
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
        :total="totalPages">
    </el-pagination>
    </el-card>
    <!-- 编辑地址dialog -->
    <el-dialog
      title="编辑地址"
      :visible.sync="editorDialogVisible"
      @close="editorDialogClose"
      >
      <el-form ref="addressForm" :model="addressForm" :rules="addressFormRules">
        <el-form-item label="省市区县" prop="address1" label-width="80px">
          <!-- 级联选择器 -->
          <el-cascader
            :options="citydata"
            v-model="addressForm.address1"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2" label-width="80px">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editorDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editorDialogVisible = false">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 物流信息dialog -->
    <el-dialog
      title="物流信息"
      :visible.sync="dialogVisible"
      >
      <!-- 时间线 -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp">
          {{activity.content}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>



<script>
  import {myRequest} from '@/network/request.js'
  import citydata from './citydata'
  export default {
    name: "Order",
    data() {
      return {
        //搜索框内容
        searchInput: '',
        //
        queryInfo: {
          pagenum: 1,
          pagesize: 10
        },
        // 订单列表
        orderList: [],
        // 总页数
        totalPages: 0,
        // 编辑dialog
        editorDialogVisible: false,
        // 地址表单
        addressForm: {
          address1: [],
          address2: ''
        },
        // 表单验证
        addressFormRules: {
          address1: [
            {required: true, message:'请输入省市区县', trigger: 'blur'}
          ],
          address2: [
            {required: true, message:'请输入详细地址', trigger: 'blur'}
          ]
        },
        // 城市地址
        citydata,
        // 物流信息
        dialogVisible: false,
        //时间线
        activities: [{
          content: '活动按期开始',
          timestamp: '2018-04-15'
        }, {
          content: '通过审核',
          timestamp: '2018-04-13'
        }, {
          content: '创建成功',
          timestamp: '2018-04-11'
        }]
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      // 获取订单列表信息
      async getOrderList() {
        const {data: res} = await myRequest({
          url: 'orders',
          params: this.queryInfo
        })
        console.log(res)
        if(res.meta.status === 200) {
          this.orderList = res.data.goods
          this.totalPages  =res.data.total
        }else{
          this.$message.error('获取订单信息失败')
        }
      },
      //分页函数 每页显示条数函数
      handleSizeChange(newsize) {
        console.log(newsize);
        this.queryInfo.pagesize = newsize
        this.getOrderList()
      },
      // 当前页码变化函数
      handleCurrentChange(pagenum) {
        console.log(pagenum);
        this.queryInfo.pagenum = pagenum
        this.getOrderList()
      },
      // 显示编辑dialog
      showEditor(val) {
        console.log(val);
        this.editorDialogVisible = true
      },
      // 编辑dialog 关闭时间
      editorDialogClose() {
        this.$refs.addressForm.resetFields()
      },
      // 物流信息
      async showLogisticsDialog() {
        this.dialogVisible = true
        console.log(1);
        // const {data: res} = await myRequest({
        //   url: '/kuaidi/1106975712662'
        // })
        // console.log(res);
      }
    }
  }
</script>



<style scoped lang="less">
  .el-breadcrumb{
    margin-bottom: 20px;
    font-size: 14px;
  }
</style>
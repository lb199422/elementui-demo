<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区 -->
  <el-card>
    <!-- 提示区 -->
    <el-alert
      title="添加商品"
      type="info"
      center
      :closable="false"
      show-icon>
    </el-alert>
    <!-- 步骤条 -->
    <el-steps :space="200" 
      :active="activeIndex - 0" 
      align-center
      finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    
    <!-- 表单 -->
    <el-form :model="addForm" :rules="addFromRules" 
      ref="addGoodsForm"  
      label-width="100px"
      label-position="top" 
      class="demo-ruleForm">
      <!-- tab 栏区域 -->
      <el-tabs tab-position="left"
        :before-leave="beforeTabLeave"
        @tab-click="tabClick"
        v-model="activeIndex">
        <!-- 商品基本信息 -->
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input  type="number" v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input type="number" v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input type="number" v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <!-- 级联选择器 -->
            <el-cascader
              v-model="cascaderValue"
              :options="goodsCategoryList"
              :props="cascaderProps"
              clearable
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        
        </el-tab-pane>
        <!-- 商品参数 -->
        <el-tab-pane label="商品参数" name="1">
          <el-form-item 
            :label="item.attr_name" 
            v-for="item in goodsManyParamList" :key="item.attr_id"> 
            <!-- 多选框 -->
            <el-checkbox-group 
              v-model="item.attr_vals" 
              @change="handleCheckedCitiesChange">
              <el-checkbox 
                v-for="(cb, index) in item.attr_vals" 
                :label="cb" 
                border
                :key="index">
                {{cb}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <!-- 商品属性 -->
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" prop="goods_name" v-for="(item, index) in goodsOnlyParamList" :key="index">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 上传图片 -->
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            :action="uploadUrl"
            :on-preview="handlePreview"
            :on-remove="removeUploadFile"
            :headers="uploadHeaders"
            :on-success="uploadSuccess"
            list-type="picture">
            <el-button size="small" type="primary">
              点击上传
            </el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 商品内容富文本编辑器 -->
          <quill-editor v-model="addForm.goods_introduce">

          </quill-editor>
          <el-button type="primary" @click="addGoods" class="add-goods-btn">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
  <!-- 预览图片 -->
  <el-dialog
    title="图片预览"
    width="30%"
    :visible.sync="previewDialogVisible">
    <img :src="previewPath" alt="" class="previewImg">
  </el-dialog>
  </div>
</template>



<script>
  import {myRequest} from '@/network/request.js'
  export default {
    name: "Add",
    data() {
      return {
        //步骤条激活索引
        activeIndex: 0,
        // 添加表单信息
        addForm: {
          // 商品名称 价格 重量 数量
          goods_name: '',
          goods_cat: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          goods_introduce: '',
          // 图片数组
          pics: [

          ],
          //商品参数
          attrs: []
        },
        // 表单验证
        addFromRules: {
          goods_name: [
            {required: true, message:'请输入商品名称', trigger: 'blur'}
          ],
          goods_price:[
            {required: true, message:'请输入商品价格', trigger: 'blur'}
          ],
          goods_weight:[
            {required: true, message:'请输入商品重量', trigger: 'blur'}
          ],
          goods_number:[
            {required: true, message:'请输入商品数量', trigger: 'blur'}
          ],
          goods_cat:[
            {required: true, message:'请选择商品分类', trigger: 'blur'}
          ]
        },
        // 商品分类列表
        goodsCategoryList: [],
        // 级联选择器配置
        cascaderProps: {
          expandTrigger: 'hover',
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        //级联选择器
        cascaderValue: [],
        // 商品动态参数
        goodsManyParamList:[],
        // 商品分类静态参数
        goodsOnlyParamList: [],
        // 图片上传地址
        uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
        // 图片上传header
        uploadHeaders: {
          //提供上传权限
          Authorization: window.sessionStorage.getItem('token')
        },
        // 图片预览地址
        previewPath: '',
        // 图片预览dialog
        previewDialogVisible: false
      }
    },
    created() {
      this.getGoodsCategoryList()
    },
    methods: {
      // 获取所有分类信息
      async getGoodsCategoryList() {
        const {data: res} = await myRequest({
          url: 'categories'
        })
        console.log(res)
        if(res.meta.status === 200) {
          this.goodsCategoryList = res.data
        }else{
          this.$message.error('获取分类信息失败')
        }
      },
      // 级联选择器事件
      handleChange() {
        console.log(this.cascaderValue)
        // 限制只能选中三级分类
        if(this.cascaderValue.length !== 3) {
          this.cascaderValue = []
        }
        this.addForm.goods_cat = this.cascaderValue.join(',')
      },
      // tab 切换前钩子函数 根据条件进行切换
      beforeTabLeave(activeName, oldName) {
        // 如果选中三级分类可以切换
        if(oldName === '0' && this.cascaderValue.length !== 3) {
          this.$message.error('请选择商品分类')
          return false
        }
      },
      // tab 点击事件
      async tabClick() {
        // 更具当前pane是否是参数 发送请求获取参数信息
        if(this.activeIndex === '1') {
          // 发送请求 获取动态参数
          const {data: res} = await myRequest({
            url: `categories/${this.cascaderValue[2]}/attributes`,
            params: {
              sel: 'many'
            }
          })
          console.log(res)
          if(res.meta.status === 200) {
            // 对data.attr_vals 进行处理转为数组
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
            })
            this.goodsManyParamList = res.data
          }else{
            this.$message.error('获取商品参数失败')
          }
          // 商品参数页
        }else if(this.activeIndex === '2') {
          // 发送请求 获取静态参数
            const {data: res} = await myRequest({
            url: `categories/${this.cascaderValue[2]}/attributes`,
            params: {
              sel: 'only'
            }
          })
          console.log(res);
          if(res.meta.status === 200) {
            this.goodsOnlyParamList = res.data
          }else{
            this.$message.error('获取商品参数失败')
          }
          
        }
      },
      // checkbox-group函数
      handleCheckedCitiesChange() {

      },
      // 点击文件列表中预览文件时的钩子
      handlePreview(file) {
        console.log(file);
        // 拿到文件地址
        // 弹出dialog
        this.previewPath = file.response.data.url
        this.previewDialogVisible = true
      },
      // 文件上传成功函数
      uploadSuccess(res) {
        console.log(res)
        // 1拿到上传图片的临时路径 push 到pics中 
        const picUrl = {pic: res.data.tmp_path}
        this.addForm.pics.push(picUrl)
      },
      // 文件列表移除文件时的钩子
      removeUploadFile(file) {
        console.log(file)
        // 先拿到删除文件临时定制
        // 找到文件在addForm.pics数组中的索引值
        // 删除addForm.pics 中的对应向
        let picPath = file.response.data.tmp_path
        let pathIndex = this.addForm.pics.findIndex(item => item.pic === picPath)
        this.addForm.pics.splice(pathIndex, 1)
      },
      //添加商品事件
      addGoods() {
        // 先判断表单验证是否完成
        // 对数据进行必要的处理
        // 再向服务器提交
        
        this.$refs.addGoodsForm.validate(async validate => {
          if(validate) {
            console.log(1);
            // 遍历静态数组
            this.goodsOnlyParamList.forEach(item => {
              let newInfo ={attr_id: item.attr_id, attr_value: item.attr_vals}
              this.addForm.attrs.push(newInfo)
            })
            // 遍历动态参数
            this.goodsManyParamList.forEach(item => {
              let newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join(' ')}
              this.addForm.attrs.push(newInfo)
            })
            console.log(this.addForm)
            // 返送请求添加商品
            const {data: res} = await myRequest({
              url: 'goods',
              method: 'POST',
              data: this.addForm
            })
            console.log(res)
            if(res.meta.status === 201){
              this.$message.success(res.meta.msg)
              this.$router.push('/goods')
            }else{
              this.$message.error(res.meta.msg) 
            }
          }else{
            this.$message.error('请输入必要的表单内容')
          }
        })
      }
    }
  }
</script>



<style scoped lang="less">
  .el-breadcrumb{
    margin-bottom: 20px;
    font-size: 14px;
  }
  .el-checkbox{
    margin: 0 !important;
    margin-right: 20px !important;
  }
  .previewImg{
    width: 100%;
  }
  .add-goods-btn{
    margin-top: 20px;
  }
</style>
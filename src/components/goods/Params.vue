<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- el-card  -->
    <el-card>
      <el-alert
        title="注意： 只允许为第三级分类设置相关参数！"
        :closable="false"
        show-icon
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类区 -->
      <el-row class="goods-category-row">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="cascaderSelectVal"
            :options="goodsCateList"
            :props="cascaderGoodsCate"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isAddParamsDisable"
            @click="addGoodsParams"
          >
            添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="goodsParamsList" border style="width: 100%">
            <!-- 展开列 -->
            <el-table-column type="expand">
              <!-- 遍历生成tag -->
              <template slot-scope="scope">
                <el-tag
                  type="success"
                  v-for="(item, index) in scope.row.attr_vals"
                  closable
                  @close="handleClose(index, scope.row)"
                  :key="index"
                >
                  {{ item }}
                </el-tag>
                <!-- 动态编辑标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  + New Tag
                </el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditParamsDialog(scope.row)"
                  icon="el-icon-edit"
                >
                </el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParams(scope.row)"
                  icon="el-icon-delete"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isAddParamsDisable"
            @click="addGoodsParams"
          >
            添加参数
          </el-button>
          <!-- 静态参数表格 -->
          <el-table :data="goodsParamsList" border style="width: 100%">
            <!-- 展开列 -->
            <el-table-column type="expand">
              <!-- 遍历生成tag -->
              <template slot-scope="scope">
                <el-tag
                  type="success"
                  v-for="(item, index) in scope.row.attr_vals"
                  closable
                  @close="handleClose(index, scope.row)"
                  :key="index"
                >
                  {{ item }}
                </el-tag>
                <!-- 动态编辑标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  + New Tag
                </el-button>
              </template>
              
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditParamsDialog(scope.row)"
                  icon="el-icon-edit"
                >
                </el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteParams(scope.row)"
                  icon="el-icon-delete"
                >
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数dialog -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="addGoodsParamsDialogVisible"
      @close="addParamsDialogClose"
    >
      <!-- 添加参数表单 -->
      <el-form
        ref="addParamsForm"
        :model="addParamsForm"
        :rules="addFormRules"
        label-width="120px"
      >
        <el-form-item :label="'添加' + dialogTitle" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addGoodsParamsDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="addParams">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改参数dialog -->
    <el-dialog
      :title="'编辑' + dialogTitle"
      :visible.sync="editParamsDialogVisible"
    >
      <!-- 修改参数表单 -->
      <el-form
        ref="editParamsForm"
        :model="editParamsForm"
        :rules="addFormRules"
        label-width="120px"
      >
        <el-form-item :label="'编辑' + dialogTitle" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
import { myRequest } from "../../network/request";
export default {
  name: "Params",
  data() {
    return {
      // 所有商品分类列表
      goodsCateList: [],
      // 级联选择器数据
      cascaderSelectVal: [],
      //级联选择器配置props
      cascaderGoodsCate: {
        // 配置数据解构
        label: "cat_name",
        value: "cat_id",
        children: "children",
        //设置级联选择器打开方式
        expandTrigger: "hover",
      },
      // tab 标签页数据
      activeName: "many",
      //商品参数列表
      goodsParamsList: [],
      //添加参数dialog 显示
      addGoodsParamsDialogVisible: false,
      // 添加参数dialog title
      // addParamsDialogTitle: '添加动态参数',
      // 添加参数表单对象
      addParamsForm: {
        attr_name: "",
      },
      // 表单验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 修改参数dialog
      editParamsDialogVisible: false,
      // 修改参数表单对象
      editParamsForm: {
        attr_name: "",
        attr_sel: "",
        attr_vals: ""
      },
      // 修改参数分类id 属性attrid
      editParamCateId: "",
      editParamAttrId: "",
      //动态编辑标签
      // inputVisible: false,
      //动态编辑标签绑定内容
      // inputValue: "",
    };
  },
  created() {
    this.getGoodsCategoryList();
  },
  computed: {
    // 添加参数按钮是否可用
    isAddParamsDisable() {
      // 当选中三级分类是可用
      return this.cascaderSelectVal.length === 3 ? false : true;
    },
    // 选中商品分类id
    goodsId() {
      return this.cascaderSelectVal[this.cascaderSelectVal.length - 1];
    },
    // 根据this.activeName 判断是添加哪种属性
    dialogTitle() {
      return this.activeName === "many" ? "动态参数" : "静态参数";
    },
  },
  methods: {
    // 获取所有商品分类
    getGoodsCategoryList() {
      myRequest({
        url: "categories",
      }).then((res) => {
        console.log(res);
        if (res.data.meta.status === 200) {
          this.goodsCateList = res.data.data;
        } else {
          this.$message.error("获取数据失败");
        }
      });
    },
    // 级联选择器触发事件
    handleChange() {
      // 选中的不是三级分类
      if (this.cascaderSelectVal.length !== 3) {
        this.cascaderSelectVal = [];
        // 避免选中三级分类后再次选中二级分类没清空表格数据
        this.goodsParamsList = []
      } else {
        // 选中的三级分类
        console.log(this.cascaderSelectVal);
        // 获取对应商品的参数列表
        this.getGoodsParamsList();
      }
    },
    //tab 标签页函数
    handleClick() {
      console.log(this.activeName);
      // 标签页切换获取对应的参数列表
      if (this.cascaderSelectVal.length === 3) {
        this.getGoodsParamsList();
      }
    },
    // 获取商品参数列表
    getGoodsParamsList() {
      myRequest({
        url: `categories/${this.goodsId}/attributes`,
        params: {
          sel: this.activeName,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.meta.status === 200) {
          // 遍历this.goodsParamsList 获取展开行的数据 转为数组
          res.data.data.forEach((item) => {
            //判断attr_vals 是否为空解决产生空tag 为空时返回[]
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            // 为每一行赋值一个inputVisible 避免动态编辑标签联动
            item.inputVisible = false
            item.inputValue = ''
          });
          this.goodsParamsList = res.data.data;
        } else {
          this.$message.error("获取参数列表失败");
        }
      });
    },
    //添加商品参数 弹出dialog 动态加载样式
    addGoodsParams() {
      this.addGoodsParamsDialogVisible = true;
      console.log(this.activeName);
      // 根据this.activeName 判断是添加哪种属性
      // if(this.activeName === 'many') {
      //   this.addParamsDialogTitle = '动态参数'
      // }else{
      //   this.addParamsDialogTitle = '静态参数'
      // }
    },
    // 添加商品参数 dialog 关闭事件清空表单中的数据
    addParamsDialogClose() {
      this.$refs.addParamsForm.resetFields();
    },
    // 向服务器添加参数
    addParams() {
      // 判断表单是否验证成功 成功发起请求
      this.$refs.addParamsForm.validate((validate) => {
        if (validate === true) {
          myRequest({
            url: `categories/${this.goodsId}/attributes`,
            method: "POST",
            data: {
              attr_name: this.addParamsForm.attr_name,
              attr_sel: this.activeName,
            },
          }).then((res) => {
            console.log(res);
            if (res.data.meta.status === 201) {
              this.$message.success(res.data.meta.msg);
              this.addGoodsParamsDialogVisible = false;
              //添加成功后重新调获取参数行数更新页面数据
              this.getGoodsParamsList();
            } else {
              this.$message.error("添加参数失败");
            }
          });
        } else {
          this.$message.error("表单验证失败");
        }
      });
    },
    // 显示编辑参数dialog
    showEditParamsDialog(row) {
      this.editParamsDialogVisible = true;
      console.log(row);
      // 获取发送请求时的参数
      this.editParamsForm.attr_name = row.attr_name;
      this.editParamsForm.attr_sel = row.attr_sel;
      this.editParamsForm.attr_vals = row.attr_vals.join(' ');
      this.editParamCateId = row.cat_id;
      this.editParamAttrId = row.attr_id;
    },
    // 像服务器发送请求提交修改参数
    editParams() {
      myRequest({
        url: `categories/${this.editParamCateId}/attributes/${this.editParamAttrId}`,
        method: "PUT",
        data: this.editParamsForm,
      }).then((res) => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg);
          this.getGoodsParamsList();
          this.editParamsDialogVisible = false;
        } else {
          this.$message.error("编辑失败");
        }
      });
    },
    // 删除参数
    deleteParams(row) {
      console.log(row);
      this.$confirm("此操作将永久删除参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          myRequest({
            url: `categories/${row.cat_id}/attributes/${row.attr_id}`,
            method: "DELETE",
          }).then((res) => {
            console.log(res);
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg);
              this.getGoodsParamsList();
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 动态编辑标签 文本框失去焦点
    handleInputConfirm(row) {
      console.log(row)
      this.saveAttrVal(row)
    },
    // 动态编辑标签 按钮事件
    showInput(row) {
      row.inputVisible = true
      // 页面重新渲染之后才会执行$nextTick 回调函数
      this.$nextTick(() => {
        // 让文本框自动获得焦点
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    //删除标签
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVal(row)
    },
    // 将假条参数标签修删除标签抽离成一个函数
    saveAttrVal(row) {
      // 如果输入内容为空  将输入框内容push到attr_vals中
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }else{
        // 当输入内容不为空时 提交参数
        // 将inputValue 输入push 到attr_vals
        row.attr_vals.push(row.inputValue)
        myRequest({
          url: `categories/${row.cat_id}/attributes/${row.attr_id}`,
          method: 'PUT',
          data: {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' ')
          }
        }).then(res => {
          console.log(res)
          if(res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            // 刷新页面内容
            // this.getGoodsParamsList()
            row.inputValue = ''
            row.inputVisible = false
          }else{
            this.$message.error('添加失败')
          }
        })
      }
    }
  },
};
</script>



<style scoped lang="less">
.el-card {
  margin-top: 20px;
  .goods-category-row {
    margin-top: 10px;
    font-size: 16px;
  }
}
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 0 20px;
}
.input-new-tag {
  width: 100px;
}
</style>
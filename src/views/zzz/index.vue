<template>
  <div id="app" class="app-container">
    <div>
      <br />&nbsp;&nbsp;&nbsp;
      <el-button class="el-icon-edit" @click="showUserForm">添加</el-button>
      <!-- 抽屉 2.7.2 暂无-->

      <!-- 添加 -->
      <el-dialog title="添加" :visible.sync="dialogFormVisible">
        <el-form :model="userForm" label-width="120px" ref="userForm" :rules="rules">
          <el-form-item label="用户名称" :label-width="formLabelWidth" prop="username">
            <el-input v-model="userForm.username" autocomplete="off" clearable></el-input>
          </el-form-item>
          <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="userForm.password" autocomplete="off" clearable show-password></el-input>
          </el-form-item>
          <el-form-item label="年龄" :label-width="formLabelWidth" prop="age">
            <el-input v-model.number="userForm.age" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="单选" :label-width="formLabelWidth" prop="radio">
            <el-radio v-model="userForm.radio" label="1">备选项</el-radio>
            <el-radio v-model="userForm.radio" label="2">备选项</el-radio>
          </el-form-item>
          <el-form-item label="活动性质" prop="type">
            <el-checkbox-group v-model="userForm.type">
              <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
              <el-checkbox label="地推活动" name="type"></el-checkbox>
              <el-checkbox label="线下主题活动" name="type"></el-checkbox>
              <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="日期" :label-width="formLabelWidth" prop="date">
            <el-date-picker
              v-model="userForm.date"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="选项" :label-width="formLabelWidth" prop="region">
            <el-select v-model="userForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth" prop="desc">
            <el-input v-model="userForm.desc" autocomplete="off" clearable type="textarea"></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="add">确 定</el-button>
            <el-button @click="resetForm('userForm')">重 置</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click.prevent.enter="submitForm('userForm')">确 定</el-button>
          <el-button @click.prevent="resetForm('userForm')">重 置</el-button>
          <el-button @click.prevent="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>&nbsp;&nbsp;&nbsp;
      <el-button class="el-icon-edit-outline" @click.prevent="update">修改</el-button>&nbsp;&nbsp;&nbsp;
      <el-button class="el-icon-delete" @click.prevent="deleteRow" plain>删除</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-input placeholder="请输入用户名" style="width:200px" v-model="keywords"></el-input>
      <el-button type="primary" icon="el-icon-search" @click.prevent.enter="search(keywords)">搜索</el-button>
    </div>
    <br />
    <div>
      <el-table
        class="userTableClass"
        ref="userTable"
        :data="userList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        stripe
        border
        v-loading
        size="medium"
        fit
        show-header
        highlight-current-row
        @current-change="handleSelectCurrentChange"
        style="width: 95%"
        :index="indexMethod"
      >
        <!-- 
        @cell-dblclick="dbClickRow"
        :index="indexMethod"
          default-sort 
          v-loading="loading"
        -->
        <!-- <el-table-column align="center" label="序号" type="index" width="50"></el-table-column> -->
        <el-table-column align="center" type="selection" width="55" sortable></el-table-column>
        <!-- <el-table-column align="center" property="id" label="用户id" width="80"></el-table-column> -->
        <el-table-column align="center" property="username" label="用户名" width="120" sortable></el-table-column>
        <el-table-column align="center" property="age" label="年龄" width="80" sortable></el-table-column>
        <el-table-column align="center" property="password" label="密码" width="120" sortable></el-table-column>
        <el-table-column align="center" property="date" label="日期" width="150" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" property="isPass" label="是否通过" width="120">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.isPass == '1' ? 'success' : 'danger'"
              disable-transitions
            >{{scope.row.isPass == '1' ? '是': "否"}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <br />
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 6, 7, 8]"
        :page-size="pagesize"
        layout="  prev, pager, next, sizes, total, jumper "
        prev-text="上一页"
        next-text="下一页"
        :total="userList.length"
      ></el-pagination>
    </div>
    <!-- 
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection([userList[1], userList[2]])">切换第二、第三行的选中状态</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button>
    </div> 
    -->
  </div>
</template>
<script>
import service from "../../utils/request";
export default {
  name: "userTable",
  data() {
    return {
      currentRow: null, //选择row记录
      userList: "", //数据表格
      defaultSort: "", //表格默认排序规则
      currentPage: 1, //初始页
      pagesize: 5, //默认每页的数据
      total: "",
      keywords: "", //搜索
      user: "", //查看单个bean
      //抽屉

      //form
      dialogTableVisible: false,
      dialogFormVisible: false,
      userForm: {
        radio: "", //默认单选
        name: "",
        id: "",
        username: "",
        age: "",
        password: "",
        type: [],
        region: "",
        date: "", //日期默认值
        desc: ""
      },
      formLabelWidth: "120px",
      rules: {
        //form 规则
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ],
        age: [
          { required: true, message: "年龄不能为空" },
          { type: "number", message: "年龄必须为数字值" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        // date: [
        //   {
        //      type: "date",
        //     required: true,
        //     message: "请选择日期",
        //     trigger: "change"
        //   }
        // ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      }
    };
  },
  components: {},
  created() {
    //页面初始化加载
    this.getUsers();
  },
  methods: {
    //form
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    dbClickRow() {
      console.log("----------");
      this.drawer = true;
    },
    showUserForm() {
      this.dialogFormVisible = true;
      this.resetForm("userForm");
    },
    //选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //获取选中的行
    handleSelectCurrentChange(row) {
      this.currentRow = row;
      console.log(row);
      this.$refs.userTable.toggleRowSelection(row, true); //点击选中多个selection
      // this.$refs.userTable.setCurrentRow(row);//点击选中多个selection
      // this.$refs.userTable.selection//[] 已经被选中的行
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      //copy对象
      // Object.assign(taget, sources)
      // this.resetForm("userForm");
    },
    indexMethod(index) {
      return index * 1;
      // return (this.currentPage - 1) * this.pageSize + index + 1;
      // return (this.currentPage-1) * this.pageSize + index + 1
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function(size) {
      this.pagesize = size;
      console.log(this.pagesize); //每页下拉显示数据
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage); //点击第几页
    },
    //弹窗
    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm("确定要提交表单吗？")
        .then(_ => {
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
            }, 400);
          }, 2000);
        })
        .catch(_ => {});
    },
    cancelForm() {
      this.loading = false;
      this.dialog = false;
      clearTimeout(this.timer);
    },
    //server
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert("submit!");
          this.add();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //username查询
    search(keywords) {
      if (keywords.length == 0 || keywords == "") {
        this.getUsers();
      }
      service
        .get("/user/getUsers", {
          params: {
            username: keywords
          }
        })
        .then(res => {
          if (res.status == "success") {
            this.userList = res.data.data;
            // this.total = res.data.total;
            this.total = res.data.length;
          } else {
            alert("获取失败了~~~");
          }
        });
    },
    //所有
    async getUsers() {
      service.get("/user/getUsers").then(res => {
        if (res.status == "success") {
          this.userList = res.data.data;
          this.total = res.data.total;
        } else {
          alert("获取失败了~~~");
        }
      });
    },
    //添加
    add() {
      service
        .post("/user/add", this.userForm)
        .then(res => {
          if (res.status == "success") {
            this.userForm.resetFields;
            this.$message({
              type: "success",
              message: "添加成功"
            });
          }
          this.resetForm("userForm");
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "错误"
          });
        });
    },
    //修改
    update() {
      this.getuserInfoById();
      //保存form数据 ----> 与 add添加user 一个方法
      // service.post('/user/updateUser',this.userForm).then(res=>{
      //   if(res.data == 'ok'){

      //   }
      // });
    },
    //根据id查user
    getuserInfoById() {
      var _selectData = this.$refs.userTable.selection;

      if (_selectData.length != 1) {
        //选择多行数据
        const h = this.$createElement;
        this.$notify({
          title: "温馨提示",
          message: h("i", { style: "color: teal" }, "请选择一条数据")
        });
        return;
      }
      service
        .get("/user/getUserInfoById", {
          params: {
            id: _selectData[0].id
          }
        })
        .then(res => {
          // this.user = res.data
          this.dialogFormVisible = true;

          // Object.assign(taget, sources)
          Object.assign(this.userForm, res.data);
        });
    },
    //单个delete
    deleteRow() {
      if (this.currentRow == null) {
        const h = this.$createElement;
        this.$notify({
          title: "温馨提示",
          message: h("i", { style: "color: teal" }, "未选择需要删除的记录")
        });
      } else {
        //选择记录数
        var _selectData = this.$refs.userTable.selection;
        if (_selectData.length > 1) {
          //选择多行数据
          const h = this.$createElement;
          this.$notify({
            title: "温馨提示",
            message: h("i", { style: "color: teal" }, "请选择一条数据删除")
          });
          return;
        }
        //单行删除
        var deleteId = _selectData[0].id;
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$message({
              type: "success",
              message: "删除成功!---" + deleteId
            });
            //置为
            this.currentRow = null;
            this.getUsers();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    }
  }
};
</script>
<style>
/* .app-container .userTableClass{

  } */
</style>

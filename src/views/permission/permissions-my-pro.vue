<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddPerm_1">新增一级</el-button>
    <el-button type="primary" @click="handleAddPerm_2">新增二级</el-button>
    <div>
      <el-table
        :data="tableData"
        ref="tableData"
        row-key="id"
        style="width: 100%;margin-top:30px;"
        border
      >
        <el-table-column label="权限 ID" prop="id"></el-table-column>
        <el-table-column label="权限名称" prop="label"></el-table-column>
        <el-table-column label="描述" prop="desc"></el-table-column>
      </el-table>
    </div>

    <!-- 1级目录 -->
    <!-- 通过 自定义 属性 :dialogType, 来判断是new 还是edit -->
    <el-dialog :visible.sync="dialogVisible_1" :title="'新增一级目录'">
      <el-form
        :model="thisMenu"
        label-width="80px"
        label-position="left"
        :rules="rules"
        ref="thisMenu"
      >
        <el-form-item label="一级菜单" prop="thisFirMenu">
          <el-input v-model="thisMenu.thisFirMenu" placeholder="一级 Name" style="width:300px" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible_1=false">Cancel</el-button>
        <el-button type="primary" @click="confirmPerm_1('thisMenu')">Confirm</el-button>
      </div>
    </el-dialog>
    <!-- 二级目录 -->
    <!-- 通过 自定义 属性 :dialogType, 来判断是new 还是edit -->
    <el-dialog :visible.sync="dialogVisible_2" :title="'新增二级目录'">
      <el-form
        :model="thisMenu"
        label-width="80px"
        label-position="left"
        :rules="rules"
        ref="thisMenu"
      >
        <!-- 注意
          1.一般form 表单,都需要在data 中定义 相对应的数据组[] ,并且规定rules,
          2.
          el-select 的 v-model="value" ,value该选项为''
          value:'' , 该value 为 下拉菜单选择的属性 :value的值,但是, 一般使用form数据组,来规定提交的rules,
          这样就必须使用rules和form数据组的字段一直,并且,在v-model中也要相对应
          3.
          得到vue 下拉框的 值: 直接用el-select标签里的v-model中的数据来获取
        -->
        <el-form-item label="一级菜单" prop="thisFirMenu">
          <el-select v-model="thisMenu.thisFirMenu" placeholder="请选择" style="width:300px" ß>
            <el-option
              ref="select"
              v-for="item in permParentMenu"
              :key="item.pId"
              :label="item.pLabel"
              :value="item.pId"
            >
              <span style="float: left">{{ item.pLabel }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.pLabel }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级菜单" prop="thisSecMenu">
          <el-input v-model="thisMenu.thisSecMenu" placeholder="二级菜单 Name" style="width:300px" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible_2=false">Cancel</el-button>
        <el-button type="primary" @click="confirmPerm_2('thisMenu')">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import {
  getRoutes,
  getRoles,
  addRole,
  deleteRole,
  updateRole,
  //pro
  getRoutesPro
} from "@/api/role";

//引入permissions
import {
  //pro
  getPerMenu,
  addSecMenu,
} from "@/api/permissions";

import service from "../../utils/request";



const defaultRole = {
  key: "",
  name: "",
  description: "",
  routes: [],
  //自定义de属性
  roleId: "",
  roleName: "",
  roleDesc: "",
  permissionsChecked: [],
  checkedKeys: ""
};
//

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "title"
      },
      //已拥有的权限
      permissionsChecked: [],
      tableData: [],
      permParentMenu: [],
      //el-select,注意该选项为''
      // value: "",
      //一级目录
      dialogVisible_1: false,
      dialogVisible_2: false,
      thisMenu: {
        thisFirMenu: "",
        thisSecMenu: ""
      },
      rules: {
        thisFirMenu: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        thisSecMenu: [
          { required: true, message: "请输入二级名称", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  watch: {
    //通过 监听 来实现 初始化已有的权限
    dialogVisible(now, before) {
      if (now == false) {
        //此方法无效
        // this.permissionsChecked = [];
        //element这个el-tree组件是是采用赋值的方式改变是否勾选的，所以你应该使用组件中提供的this.$refs.tree.setCheckedKeys([]);这个方法来清空勾选项。
        this.$refs.tree.setCheckedKeys([]);
      }
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    //获取 role menu
    this.getRoutesPro();
    this.getParentMenu();

    // 初始化监听  === 这不是一个方法
    // this.dialogVisible();
  },
  methods: {
    thisSelect(id) {
      console.log(id);
    },
    async getParentMenu() {
      const res = await getPerMenu();
      this.permParentMenu = res.data;
    },
    getPermissionsById(scope) {
      service.get("/role/getPermissionsById/" + scope.row.roleId).then(res => {
        this.permissionsChecked = res.data;
        // 手动选中节点 - 可代替默认选中
        for (const i of res.data) {
          this.$refs.tree.setChecked(i, true, false);
        }
        //接受勾选节点的数组
        //  this.$refs.tree.setCheckedNodes()
      });
      //查看选中
    },
    async getRoutesPro() {
      const res = await getRoutesPro();
      this.serviceRoutes = res.data;
      this.tableData = res.data;
      //不被系统处理 ,直接返回routes
      //   this.routes = this.generateRoutes(res.data)
      this.routes = res.data;
    },
    handleAddPerm_1() {
      this.role = Object.assign({}, defaultRole);
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([]);
      }
      this.dialogType = "new_1";
      this.dialogVisible_1 = true;
    },
    handleAddPerm_2() {
      this.role = Object.assign({}, defaultRole);
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([]);
      }
      this.dialogType = "new_2";
      this.dialogVisible_2 = true;
    },

    async confirmRole() {
      const isEdit = this.dialogType === "edit";

      //获得选中的树节点  , 后台需要判断是否选中的根节点
      const checkedPermissions = this.$refs.tree.getCheckedKeys();
      console.log(checkedPermissions + "===" + isEdit);
      const chkNodes = this.$refs.tree.getCheckedNodes();
      console.log(chkNodes + "===");
      //赋值
      this.role.checkedKeys = checkedPermissions;

      // const checkedKeys = this.$refs.tree.getCheckedKeys()
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        //修改
        // await updateRole(this.role.key, this.role)
        console.log(this.role.roleId);
        await updateRole(this.role.roleId, this.role);
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role));
            break;
          }
        }
      } else {
        //添加
        const { data } = await addRole(this.role);
        this.role.key = data.key;
        this.rolesList.push(this.role);
      }

      const { roleDesc, roleId, roleName } = this.role;
      this.dialogVisible = false;
      this.$notify({
        title: "Success",
        dangerouslyUseHTMLString: true,
        message: `
              <div>Role Key: ${roleId}</div>
              <div>Role Name: ${roleName}</div>
              <div>Description: ${roleDesc}</div>
            `,
        type: "success"
      });
    },
    //添加2级
    async confirmPerm_2(formName) {
        //role: Object.assign({}, this.thisMenu),
          //重置
          //this.$refs[formName].resetFields();
           
        

      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.thisMenu.thisFirMenu);
          console.log(this.thisMenu.thisSecMenu);
        
          var pid = this.thisMenu.thisFirMenu
          var label = this.thisMenu.thisSecMenu
          //注意,在form.validate ({})里 ,不能使用同步await关键字调用方法
        //  const res = await addSecMenu(pid,label)
         const res = addSecMenu(pid,label)

         
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //添加1级
    async confirmPerm_1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.thisMenu.thisFirMenu);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>

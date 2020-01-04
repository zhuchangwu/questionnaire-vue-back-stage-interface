<template>
  <div style="padding: 30px">
    <el-row>
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="inputSearch">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" icon="el-icon-search" @click="doInputSearch">搜索</el-button>
      </el-col>
    </el-row>
    <div class="myDiv">
      <el-table
        :data="currentPageData"
        style="width: 100%">
        <el-table-column
          label="#Id"
          width="90"
          prop="id">
        </el-table-column>
        <el-table-column
          label="昵称"
          width="230"
          prop="name">
        </el-table-column>
        <el-table-column
          label="账号"
          width="230"
          prop="username">
        </el-table-column>
        <el-table-column
          label="手机号"
          width="230"
          prop="phone">
        </el-table-column>
        <el-table-column
          label="邮箱"
          width="230"
          prop="email">
        </el-table-column>
        <el-table-column
          label="角色"
          width="200"
          prop="rolesDto">
        </el-table-column>
        <el-table-column
          label="状态"
          width="190"
          prop="status">
        </el-table-column>

        <el-table-column
          label="操作"
          width="229"
          align="left">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==='活跃'"
              size="mini"
              type="info"
              @click="handleForbidUser(scope.$index, scope.row)">禁用
            </el-button>
            <el-button
              size="mini"
              v-else
              type="success"
              @click="handleActiveUser(scope.$index, scope.row)">激活
            </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block myDiv">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 15, 20, 25]"
        :pageSize="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-position="left">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色信息" :label-width="formLabelWidth">
          <el-select v-model="form.rolesDto" placeholder="修改用户的角色信息">
            <el-option label="管理员" value="ROLE_ADMIN"></el-option>
            <el-option label="普通用户" value="ROLE_USER"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseEdit">取 消</el-button>
        <el-button type="primary" @click="handleDoEdit(form.id)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import user from '@/api/user'
  import {Message} from 'element-ui'

  export default {
    name: "complex-table",
    data() {
      return {
        inputSearch: '',
        total: 0, // 总条数
        currentPage: 1, // 当前页
        pageSize: 10, // 每页大小
        currentPageData: [], // 当前页的数据
        dialogFormVisible: false,
        form: {},
        formLabelWidth: '120px'
      }
    },
    created() {
      // 拉取分页的数据
      this.doGetUserByPage(1, 10);
    },
    methods: {
      doGetUserByPage(currentPage, limit, name) {
        user.getUserByPage(currentPage, limit, name).then(res => {
          // 格式化
          for (var i = 0; i < res.data.content.length; i++) {
            // 状态
            var status = res.data.content[i].status;
            if (status === 0) {
              res.data.content[i].status = '活跃';
            } else if (status === 1) {
              res.data.content[i].status = '禁用';
            }
            if (res.data.content[i].rolesDto === 'ROLE_ADMIN') {
              res.data.content[i].rolesDto = '管理员'
            } else if (res.data.content[i].rolesDto === 'ROLE_USER') {
              res.data.content[i].rolesDto = '普通用户'
            }
          }
          this.currentPageData = res.data.content;
          this.total = res.data.totalElements;
        }).catch(error => {
        })
      },
      // 发送请求, 拉取用户的信息
      handleEdit(index, row) {
        user.edit(row.id).then(res => {
          if (res.data.rolesDto==='ROLE_ADMIN'){
            res.data.rolesDto = '管理员'
          }
          this.form = res.data
          // 将数据填充到模态框中
          this.dialogFormVisible = true;
        }).catch(error => {})
      },
      handleCloseEdit() {
        this.dialogFormVisible = false;
        this.from = [];
      },
      handleDoEdit(id) {
        user.doEdit(this.form).then(res => {
          // 清空模态框
          this.dialogFormVisible = false
          this.form=[];
          this.doGetUserByPage(this.currentPage, this.pageSize);
        }).catch(error => {
        })
      },
      // 激活用户
      handleActiveUser(index, row) {
        user.activeUser(row.id).then(res => {
          Message.success(res.msg)
          this.doGetUserByPage(this.currentPage, this.pageSize);
        })
      },
      // 禁用用户
      handleForbidUser(index, row) {
        user.forbidUser(row.id).then(res => {
          Message.success(res.msg)
          this.doGetUserByPage(this.currentPage, this.pageSize);
        }).catch(error => {
        })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.doGetUserByPage(1, val);
      },
      handleCurrentChange(val) {
        this.doGetUserByPage(val, this.pageSize);
      },
      doInputSearch() {
        if (this.inputSearch.trim() === '') {
          Message.warning("请输入用户账号再进行搜索");
          return;
        }
        this.currentPage = 1;
        this.doGetUserByPage(this.currentPage, this.pageSize, this.inputSearch);
        this.inputSearch = ''
      }
    }
  }
</script>

<style>
  .myDiv {
    margin-top: 20px;
  }
</style>

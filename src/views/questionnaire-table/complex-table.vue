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
        border
        style="width: 100%">
        <el-table-column
          label="创建时间"
          width="180"
          prop="createTime">
        </el-table-column>
        <el-table-column
          label="过期时间"
          width="180"
          prop="endTime">
        </el-table-column>
        <el-table-column
          label="问卷标题"
          prop="title">
        </el-table-column>
        <el-table-column
          label="状态"
          width="180"
          prop="status">
        </el-table-column>
        <el-table-column
          label="创建者"
          width="180"
          prop="userName">
        </el-table-column>

        <el-table-column
          label="操作"
          width="229"
          align="left">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==='已发布'"
              size="mini"
              type="info"
              @click="handleBackOnline(scope.$index, scope.row)">下架
            </el-button>
            <el-button
              size="mini"
              v-else
              type="success"
              @click="handlePushOnline(scope.$index, scope.row)">发布
            </el-button>
            <el-button
              size="mini"
              type="warning"
              @click="handleEdit(scope.$index, scope.row)">修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
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
  </div>
</template>

<script>
  import questionnaireRequest from '@/api/questionnaireRequest'
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
      }
    },
    created() {
      // 拉取分页的数据
      this.doGetQuestionnaireByPage(1, 10);
    },
    methods: {
      doGetQuestionnaireByPage(currentPage, limit, name) {
        questionnaireRequest.getQuestionnaireByPage(currentPage, limit, name).then(res => {
          // 格式化
          for (var i = 0; i < res.data.content.length; i++) {
            // 时间
            res.data.content[i].createTime = this.formatter(res.data.content[i].createTime, 'yyyy-MM-dd hh:mm:ss')
            res.data.content[i].endTime = this.formatter(res.data.content[i].endTime, 'yyyy-MM-dd hh:mm:ss')
            // 状态
            var status = res.data.content[i].status;
            if (status === 0) {
              res.data.content[i].status = '未发布';
            } else if (status === 1) {
              res.data.content[i].status = '已发布';
            } else if (status === 2) {
              res.data.content[i].status = '已结束';
            } else if (status === 3) {
              res.data.content[i].status = ' 已删除';
            }
          }
          this.currentPageData = res.data.content;
          this.total = res.data.totalElements;
        }).catch(error=>{

        })
      },
      formatter(thistime, fmt) {
        let $this = new Date(thistime)
        let o = {
          'M+': $this.getMonth() + 1,
          'd+': $this.getDate(),
          'h+': $this.getHours(),
          'm+': $this.getMinutes(),
          's+': $this.getSeconds(),
          'q+': Math.floor(($this.getMonth() + 3) / 3),
          'S': $this.getMilliseconds()
        }
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, ($this.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt
      },
      handleEdit(index, row) {
        questionnaireRequest.getQuestionnaireById(row.id).then(res => {
          window.sessionStorage.setItem("edit-questionnaire", JSON.stringify(res.data))
          this.$router.push({path: '/documentation/index'})
        })
      },
      //上线
      handlePushOnline(index, row) {
        questionnaireRequest.pushOnline(row.id).then(res => {
          Message.success(res.msg)
          this.doGetQuestionnaireByPage(this.currentPage, this.pageSize);
        })
      },
      // 下线
      handleBackOnline(index, row) {
        questionnaireRequest.backOnline(row.id).then(res => {
          Message.success(res.msg)
          this.doGetQuestionnaireByPage(this.currentPage, this.pageSize);
        }).catch(error=>{

        })
      },
      handleDelete(index, row) {
        questionnaireRequest.delete(row.id).then(res => {
          Message.success(res.msg)
          this.doGetQuestionnaireByPage(this.currentPage, this.pageSize);
        }).catch(error=>{

        })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.doGetQuestionnaireByPage(1, val);
      },
      handleCurrentChange(val) {
        this.doGetQuestionnaireByPage(val, this.pageSize);
      },
      doInputSearch(){
        if (this.inputSearch.trim()===''){
          Message.warning("请输入问卷名称再进行搜索");
          return
        }
        this.currentPage=1;
        this.doGetQuestionnaireByPage(this.currentPage,this.pageSize,this.inputSearch)

        this.inputSearch=''
        // todo 第一次进来时 出现了400异常
      }
    }
  }
</script>

<style>
  .myDiv {
    margin-top: 20px;
  }
</style>

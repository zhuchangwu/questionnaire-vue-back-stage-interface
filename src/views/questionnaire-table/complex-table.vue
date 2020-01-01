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
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
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
              @click="handleEdit(scope.$index, scope.row)">下架
            </el-button>
            <el-button
              size="mini"
              v-else
              type="success"
              @click="handleEdit(scope.$index, scope.row)">发布
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
        :page-sizes="[3, 5, 10, 20]"
        :pageSize="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import questionnaireRequest from '@/api/questionnaireRequest'

  export default {
    name: "complex-table",
    data() {
      return {
        inputSearch: '',
        total: 0, // 总条数
        currentPage: 1, // 当前页
        pageSize: 0, // 每页大小
        currentPageData: [], // 当前页的数据
      }
    },
    created() {
      // 拉取分页的数据
      this.doGetQuestionnaireByPage(1, 10);
    },
    methods: {
      doGetQuestionnaireByPage(currentPage, limit) {
        questionnaireRequest.getQuestionnaireByPage(currentPage, limit).then(res => {
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
          this.total = res.data.numberOfElements;
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
        questionnaireRequest.getQuestionnaireById(row.id).then(res=>{

          console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
          console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
          console.log("+++++++      res      ++++++++" + JSON.stringify(res.data))
          console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
          console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

               window.sessionStorage.setItem("edit-questionnaire",JSON.stringify(res.data))
               this.$router.push({path: '/documentation/index'})
         })
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
  }
</script>

<style>
  .myDiv {
    margin-top: 20px;
  }
</style>

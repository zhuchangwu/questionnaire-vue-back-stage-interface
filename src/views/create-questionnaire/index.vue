<template>
  <div style="margin: 40px 60px">

    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <header class="header">
            <MDinput v-model="title" :maxlength="100" name="title" required>
              <span style="font-size: 23px">请输入问卷标题</span>
            </MDinput>
          </header>
          <br>
          <div class="body">
            <div class="body-wrap">
              <ol v-if="questions.length !== 0">
                <li
                  is="Question"
                  ref="Question"
                  v-on:changeTitle="changeTitle"
                  v-on:addOption="addOption"
                  v-on:deleteOption="deleteOption"
                  v-on:copyOption="copyOption"
                  v-on:changeTextQuestionRequired="changeTextQuestionRequired"
                  v-on:changeQuestionOption="changeQuestionOption"
                  v-for="(item, index) in questions"
                  :q-index="index"
                  :theQuestion="item">
                </li>
              </ol>
              <div class="add-question-box">
                <div class="toolbar">
                  <div class="btns">
                    <el-button @click="addQuestion('checkbox')" size="small" class="pan-btn  light-blue-btn" round>多选题
                    </el-button>
                    <el-button @click="addQuestion('radio')" size="small" class="pan-btn green-btn" round>单选题
                    </el-button>
                    <el-button @click="addQuestion('text')" size="small" class="pan-btn blue-btn" round>文本题</el-button>
                  </div>
                </div>
                <div class="add-question"><span class="font-family">添加问题</span></div>
              </div>
            </div>
          </div>
          <footer class="footer">
            <div class="pick-date">
              <div class="time-container">
                <el-date-picker v-model="date" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                placeholder="添加过期时间"/>
              </div>
            </div>
            <div class="questionnaire-save">
              <el-row>
                <el-button size="medium" class="pan-btn pink-btn" @click="uploadQuestionnaire" round>保存问卷</el-button>
                <el-button size="medium" @click="doPrint" class="pan-btn blue-btn" round>打印问卷</el-button>
              </el-row>
            </div>
          </footer>
        </el-card>
      </el-col>
    </el-row>


  </div>
</template>
<script>
  import Question from './Question'
  import MDinput from '@/components/MDinput'
  import questionnaireRequest from '@/api/questionnaireRequest'
  import {MessageBox, Message} from 'element-ui'

  export default {
    name: "index",
    components: {
      Question, MDinput
    },
    data() {
      return {
        title: '',
        questions: [],
        date: '',
        qnId: -1,
      }
    },
    created() {
      // 尝试从缓存中获取出问卷的信息,因此进入这个页面的动作有可能是想进来修改问卷
      var questionnaire = window.sessionStorage.getItem("edit-questionnaire");
      // todo 清除指定缓存  window.sessionStorage.clear("edit-questionnaire");
      var obj = JSON.parse(questionnaire);

      this.title = obj.title;
      this.questions = obj.questions;
      this.date = obj.exipreTime;


       window.sessionStorage.removeItem("edit-questionnaire")
    },
    methods: {
      doMessage(str) {
        MessageBox.alert(str, 'Confirm logout', {
          confirmButtonText: '确定',
          type: 'warning',
          showClose: false
        })
      },
      doPrint() {
        console.log("-----------------------------------------------------")
        console.log("--------------在控制台打印问卷打印问卷---------------")
        console.log(this.questions)
        console.log("--------------在控制台打印问卷打印问卷---------------")
        console.log("-----------------------------------------------------")
      },
      // 上传问卷
      uploadQuestionnaire() {
        // 校验参数是否正常
        if (!this.viladite()) {
          return
        }
        // 使用token做信息验证, 后端将从token中解析出userId
        let qObj = {
          "title": this.title.trim(),
          "questions": this.questions,
          "exipreTime": this.date
        }
        // 上传
        questionnaireRequest.addQuestionnaire(qObj).then(res => {
          // 添加完成，清空当前问卷就好
          qObj = {};
          this.title = '';
          this.questions = [];
          this.date = '';
          Message.success({
            message: res.msg,
            showClose: true,
            type: 'warning',
            duration: 4 * 1000
          })
        }).catch(err => {

        })
      },
      viladite() {
        if (this.title.trim() === '') {
          this.doMessage('问卷名不能为空');
          return false;
        }
        if (this.date === '') {
          this.doMessage('问卷过期时间不能为空');
          return false;
        }
        if (this.questions.length <= 0) {
          this.doMessage('题目不能为空');
          return false;
        }
        // todo
        var endTime = Date.parse(this.date);
        if (new Date() >= endTime) {
          this.doMessage('过期时间不得小于当前时间');
          return false;
        }
        return true;
      },
      // 动态添加一个 question
      addQuestion(type) {
        let option = {
          title: '请编辑题目...',
          type: type
        }
        if (type !== 'text') {
          // 选项的描述
          option.answers = ['选项1', '选项2']
          // 答案
          option.answersData = [false, false]
        } else {
          option.required = false
          option.text = ''
        }
        this.questions.push(option)
      },
      // 改变问题标题时的回调
      changeTitle: function (data) {
        this.questions[data.index].title = data.textContent
      },
      // 添加一个选项
      addOption: function (index) {
        this.questions[index].answers.push('选项' + (this.questions[index].answers.length + 1))
        this.questions[index].answersData.push(false)
      },
      // 删除当前option
      deleteOption: function (index) {
        this.questions.splice(index, 1);
        this.questions[index].answers.pop();
      },
      // 复制一份当前问题
      copyOption: function (index) {
        let temp = JSON.stringify(this.questions[index])
        let newQ = JSON.parse(temp)

        if (newQ.answersData !== undefined && newQ.answersData.length >= 2) { // 清空选择题的答案
          for (var i = 0; i < newQ.answersData.length; i++) {
            newQ.answersData[i] = false
          }
        } else { // 清空简答题的是否必填
          newQ.required = false;
        }

        this.questions.push(newQ)
        /* let option =  this.questions[index];
         this.questions.push(option);*/
      },
      // 改变指定问题的指定option
      changeQuestionOption: function (data) {
        this.questions[data.index].answers[data.answerIndex] = data.textContent;
      },
      // 设置指定index的文本填空题的是否必填
      changeTextQuestionRequired: function (index, checked) {
        this.questions[index].required = checked;
      }
    }
  }
</script>

<style lang="scss">
  .add-question-box {
    border-radius: 10px;
  }

  .add-question-box:hover {
    .toolbar {
      height: 3.4rem;
      transition: height .3s ease-in-out;
    }
  }

  .add-question {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    background: #4ab7bd;
    height: 50px;
    padding: 15px 0px;
    text-align: center;
    border-radius: 30px
  }

  .toolbar {
    height: 0px;
    overflow: hidden;
    transition: height .5s ease-in-out;
  }

  .btns {
    text-align: center;
    padding: .7rem .2rem;
    border-radius: .4rem;
    margin: 0 auto;
  }

  .font-family {
    font-family: "Microsoft" !important;
    font-weight: bolder;
    font-size: 18px;
    color: #333;
  }

  .footer {
    width: 100%;
    height: 60px;
    clear: both;
  }

  .questionnaire-save {
    width: 50%;
    padding: 20px;
    float: right;
    text-align: right;
  }

  .pick-date {
    width: 50%;
    float: left;
    padding: 20px;
  }

  .time-container {
    display: inline-block;
  }
</style>


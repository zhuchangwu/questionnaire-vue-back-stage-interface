<template>
  <el-card shadow="hover" body-style="{ padding: '0px' }" class="card-question">
    <li class="li-question">
      <div class="content">
        <div>
          <el-col :span="24">
            <p>问题{{qIndex+1}}: &nbsp</p>
            <p contenteditable="true" class="p-question-title"
               @keyup="toChangeQuestionTitle(qIndex,$event)">
              {{theQuestion.title}}
            </p>
          </el-col>
        </div>
        <ol v-if="theQuestion.type!=='text'">
          <li v-for="(answer,answerIndex) in theQuestion.answers">
            <input class="color-input-green" :type="theQuestion.type" :name="'问题'+(qIndex+1)"
                   :checked="theQuestion.answersData[answerIndex]==='true'"
                   style='display:inline-block' @click='addAnswer(theQuestion,answerIndex)'>
            <div style='display:inline-block'>
              <p contenteditable class="p-question-body" @keyup="toChangeQuestionOption(qIndex,answerIndex,$event)">
                {{answer}}</p>
            </div>
          </li>
        </ol>
        <div v-else>
          <el-input
            class="textarea1"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 10}"
            placeholder="请输入参考答案"
            v-model="theQuestion.text">
          </el-input>
        </div>

        <label v-if="theQuestion.type==='text'" for="isRequired" class="check-label">
          <input @change="toChangeTextQuestionRequired(qIndex,$event)" type="checkbox" id="isRequired"
                 :checked="theQuestion.required">
          <span>是否必填</span>
        </label>

        <div class="add-option">
          <el-button type="danger" icon="el-icon-delete" @click="toDeleteOption(qIndex)" circle></el-button>
          &nbsp &nbsp
          <el-button v-if="theQuestion.type!=='text'" type="primary" icon="el-icon-edit" @click="toAddOption(qIndex)"
                     circle></el-button>
          &nbsp &nbsp
          <el-button type="success" icon="el-icon-check" @click="toCopyOption(qIndex)" circle></el-button>
        </div>
      </div>
    </li>
  </el-card>
</template>

<script>
  export default {
    name: "question",
    data() {
      return {
        // 文本的答案
      }
    },
    /*接受父组件传递进来的值*/
    props: {
      theQuestion: {
        type: Object,
        required: true
      },
      qIndex: {
        type: Number,
        required: true
      }
    },
    methods: {
      // 添加问题的答案
      addAnswer(question, index) {
        // 多选
        if (question.type === 'checkbox') {
          question.answersData[index] === true ? question.answersData[index] = false : question.answersData[index] = true;
          // 处理单选
        } else if (question.type === 'radio') {
          // 处理单选, 将当前位置置为true, 其他位置置为 false
          for (var i = 0; i < question.answersData.length; i++) {
            question.answersData[i] = false
            if (i === index) {
              question.answersData[i] = true
            }
          }
        }
      },
      // 向父组件传递添加选项的事件
      toChangeQuestionTitle(index, event) {
        let data = {
          'index': index,
          'textContent': event.target.textContent
        }
        this.$emit("changeTitle", data)
      },
      //  向父组件传播添加选项的事件
      toAddOption(index) {
        this.$emit("addOption", index)
      },
      // 向父组件传播删除当前option的事件
      toDeleteOption(index) {
        this.$emit("deleteOption", index)
      },
      // 向父组件传播拷贝当前option的事件
      toCopyOption(index) {
        this.$emit("copyOption", index)
      },
      // 向父组件传播改变当前前问题  指定option的事件
      toChangeQuestionOption(index, answerIndex, event) {
        let data = {
          'index': index,
          'answerIndex': answerIndex,
          'textContent': event.target.textContent
        }
        this.$emit("changeQuestionOption", data)
      },
      // 向父组件传播当前文本问题是否必填
      toChangeTextQuestionRequired(qIndex, event) {
        this.$emit("changeTextQuestionRequired", qIndex, event.target.checked)
      }
    }
  }
</script>
<style lang="scss" scoped>
  /*使用scoped做样式穿透*/
  .textarea1 > > > .el-textarea__inner {
    font-family: "Microsoft" !important;
    font-size: 20px !important;
    margin-bottom: 5px;
  }

  ol {
    padding: 15px;
    list-style-type: none;
  }

  li {
    list-style-type: none;
  }

  p {
    padding: 0px;
    height: auto;
    line-height: 40px;
    display: inline-block;
    font-size: 20px;
    margin: 5px 0px;
  }

  .card-question {
    padding: 0px;
    margin-bottom: 30px;
  }

  .li-question {
    margin-bottom: 0px;
  }

  .p-question-title {
    width: 90%;
  }

  .p-question-body {
    width: 400px;
  }

  .add-option {
    visibility: hidden
  }

  .content:hover {
    width: 100%;

    .add-option {
      visibility: visible !important;
    }
  }

  .color-input-green { /*+label*/
    width: 23px;
    height: 23px;
    cursor: pointer;
  }

  .check-label {
    display: inline-block;
    margin-right: 5px;
    margin-top: 10px;
    float: right;
  }

</style>

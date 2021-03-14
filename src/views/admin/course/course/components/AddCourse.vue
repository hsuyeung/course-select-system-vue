<template>
  <a-modal
    title="添加课程"
    :visible="visible"
    okText="添加"
    cancelText="取消"
    class="edit-panel"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="saveAdd"
    @cancel="addCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="data"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <!--输入课程名-->
      <a-form-model-item label="课程名" prop="courseName">
        <a-input v-model="data.courseName" />
      </a-form-model-item>
      <!-- 课程描述 -->
      <a-form-model-item label="课程描述" prop="courseDescription">
        <a-textarea type="textarea" v-model="data.courseDescription" />
      </a-form-model-item>
      <!-- 开课时间 -->
      <a-form-model-item label="开课时间" prop="startDate">
        <a-date-picker v-model="data.startDate" />
      </a-form-model-item>
      <!-- 结课时间 -->
      <a-form-model-item label="结课时间" prop="endDate">
        <a-date-picker v-model="data.endDate" />
      </a-form-model-item>
      <!-- 考试时间 -->
      <a-form-model-item label="考试时间" prop="examDate">
        <a-date-picker show-time v-model="data.examDate"> </a-date-picker>
      </a-form-model-item>
      <!--上课教室-->
      <a-form-model-item label="教室" prop="classroom">
        <a-input v-model="data.classroom" />
      </a-form-model-item>
      <!--周学时-->
      <a-form-model-item label="周学时" prop="weeklySchoolHour">
        <a-input v-model="data.weeklySchoolHour" />
      </a-form-model-item>
      <!--周学时-->
      <a-form-model-item label="总课时" prop="courseTime">
        <a-input v-model="data.courseTime" />
      </a-form-model-item>
      <!--课程容量-->
      <a-form-model-item label="课程容量" prop="maxSelectedNum">
        <a-input v-model="data.maxSelectedNum" />
      </a-form-model-item>
      <!--学分-->
      <a-form-model-item label="学分" prop="score">
        <a-input v-model="data.score" />
      </a-form-model-item>
      <!--学分类型-->
      <a-form-model-item label="学分类型" prop="scoreType">
        <a-tree-select
          style="width: 100%"
          :value="scoreTypeSelected"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择课程所属的学分类型"
          allow-clear
          tree-default-expand-all
          @change="scoreTypeSelectChange"
        >
          <a-tree-select-node
            v-for="item in scoreTypes"
            v-show="scoreTypeSelected !== item.id"
            :key="item.id + item.scoreTypeName"
            :value="item.id"
            :title="item.scoreTypeName"
          >
          </a-tree-select-node>
        </a-tree-select>
      </a-form-model-item>
      <!--课程分类选择-->
      <a-form-model-item label="课程分类" prop="courseCategories">
        <a-tree-select
          style="width: 100%"
          :value="courseCategorySelectedItems"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择课程的分类"
          allow-clear
          multiple
          tree-default-expand-all
          @change="courseCategorySelectChange"
        >
          <a-tree-select-node
            v-for="item in courseCategories"
            v-show="!courseCategorySelectedItems.includes(item.id)"
            :key="item.id + item.courseCategoryName"
            :value="item.id"
            :title="item.courseCategoryName"
          >
          </a-tree-select-node>
        </a-tree-select>
      </a-form-model-item>
      <!-- 任课教师 -->
      <a-form-model-item label="任课教师" prop="teacher">
        <a-tree-select
          style="width: 100%"
          :value="teacherSelected"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择任课教师"
          allow-clear
          tree-default-expand-all
          @change="teacherSelectChange"
        >
          <a-tree-select-node
            v-for="item in teachers"
            v-show="teacherSelected !== item.id"
            :key="item.id + item.realName"
            :value="item.id"
            :title="item.realName"
          >
          </a-tree-select-node>
        </a-tree-select>
      </a-form-model-item>
      <!--学院选择-->
      <a-form-model-item label="开课学院" prop="academy">
        <a-tree-select
          style="width: 100%"
          :value="academySelected"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择课程开课学院"
          allow-clear
          tree-default-expand-all
          @change="academySelectChange"
        >
          <a-tree-select-node
            v-for="item in academies"
            v-show="academySelected !== item.id"
            :key="item.id + item.academyName"
            :value="item.id"
            :title="item.academyName"
          >
          </a-tree-select-node>
        </a-tree-select>
      </a-form-model-item>
      <!--课程状态-->
      <a-form-model-item label="状态" prop="isDelete">
        <!--状态-->
        <a-radio-group button-style="solid" v-model="data.isDelete">
          <a-radio-button :value="0"> 正常 </a-radio-button>
          <a-radio-button :value="1"> 已删除 </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { addCourse } from "network/course";
import responseCode from "network/responseCode";
import moment from "moment";

export default {
  name: "AddCourse",
  props: {
    scoreTypes: {
      //全部学分类型数据
      type: Array,
      default: () => {
        return [];
      },
    },
    courseCategories: {
      //全部课程分类数据
      type: Array,
      default: () => {
        return [];
      },
    },
    teachers: {
      //全部教师数据
      type: Array,
      default: () => {
        return [];
      },
    },
    academies: {
      //全部学院数据
      type: Array,
      default: () => {
        return [];
      },
    },
    visible: {
      //编辑弹窗是否可见
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      data: {}, //当前操作的课程数据（添加或修改）
      academySelected: [], //已经选择的学院信息
      scoreTypeSelected: [], //已经选择的学分分类信息
      courseCategorySelectedItems: [], //已经选择的课程分类信息
      teacherSelected: [], //已经选择的教师信息
      confirmLoading: false, //确认按钮loading
      rules: {
        //输入内容的校验规则
        courseName: [
          { required: true, message: "请输入课程名", trigger: "blur" },
        ],
        startDate: [
          { required: true, message: "请选择开课时间", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择结课时间", trigger: "change" },
        ],
        examDate: [
          { required: true, message: "请选择考试时间", trigger: "change" },
        ],
        classroom: [
          { required: true, message: "请输入上课教室", trigger: "blur" },
        ],
        weeklySchoolHour: [
          { required: true, message: "请输入周学时", trigger: "blur" },
        ],
        courseTime: [
          { required: true, message: "请输入总课时", trigger: "blur" },
        ],
        maxSelectedNum: [
          { required: true, message: "请输入课程容量", trigger: "blur" },
        ],
        score: [{ required: true, message: "请输入课程学分", trigger: "blur" }],
        // scoreType: [
        //   { required: true, message: "请选择学分类型", trigger: "blur" },
        // ],
        // courseCategories: [
        //   { required: true, message: "请选择课程分类", trigger: "blur" },
        // ],
        // teacher: [
        //   { required: true, message: "请选择任课教师", trigger: "blur" },
        // ],
        // academy: [
        //   { required: true, message: "请选择开课学院", trigger: "blur" },
        // ],
        isDelete: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
    };
  },
  methods: {
    //取消添加
    addCancel() {
      this.data = {};
      this.$emit("cancel");
    },
    //学院选择发生变化
    academySelectChange(value) {
      this.academySelected = value;
    },
    //学分类型选择发生变化
    scoreTypeSelectChange(value) {
      this.scoreTypeSelected = value;
    },
    //课程分类选择发生变化
    courseCategorySelectChange(value) {
      this.courseCategorySelectedItems = value;
    },
    //任课教师选择发生变化
    teacherSelectChange(value) {
      this.teacherSelected = value;
    },
    //添加课程
    saveAdd() {
      this.$refs.ruleForm.validate((valid) => {
        //校验规则
        if (valid) {
          this.data.startDate = moment(this.data.startDate).format(
            "YYYY-MM-DD"
          );
          this.data.endDate = moment(this.data.endDate).format("YYYY-MM-DD");
          this.data.examDate = moment(this.data.examDate).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          this.data.canSelected = true;
          this.data.isEnd = moment().isBefore(moment(this.data.endDate));
          // 对学院信息整理
          let academy = this.academies.filter(
            (item) => this.academySelected === item.id
          )[0];
          this.data.academy = academy;
          // 对学分类型信息整理
          let scoreType = this.scoreTypes.filter(
            (item) => this.scoreTypeSelected === item.id
          )[0];
          this.data.scoreType = scoreType;
          // 对课程分类信息整理
          let courseCategories = this.courseCategories.filter(
            (item) => this.courseCategorySelectedItems.includes(item.id)
          );
          this.data.courseCategories = courseCategories;

          // 对任课教师信息整理
          let teacher = this.teachers.filter(
            (item) => this.teacherSelected === item.id
          )[0];
          this.data.teacher = teacher;
          //设置确认按钮为加载状态
          this.confirmLoading = true;
          //发送添加请求
          addCourse(this.data)
            .then((res) => {
              //判断状态码
              if (res.code === 20000) {
                this.$message.success({
                  content: "添加成功",
                });
                // 触发添加成功的事件
                this.$emit("success");
              } else {
                responseCode(res.code, this);
              }
            })
            .catch((err) => {
              responseCode(-1, this);
            });
          //取消确认按钮的加载状态
          this.confirmLoading = false;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.item {
  margin-bottom: 15px;
}
</style>

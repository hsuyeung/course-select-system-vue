<template>
  <a-table
    :columns="getColumns"
    :row-key="(record) => record.id"
    :data-source="data"
    :pagination="{ total: totalPage }"
    :loading="loading"
    bordered
    @change="handleTableChange"
  >
    <!--    id显示的模板-->
    <template slot="id" slot-scope="id">
      <div style="font-weight: bold">
        {{ id }}
      </div>
    </template>

    <!--    状态显示的模板-->
    <template slot="isDelete" slot-scope="isDelete">
      <a-tag v-if="isDelete === 'UNDELETED'" color="#1890FF">正常</a-tag>
      <a-tag v-else-if="isDelete === 'DELETED'" color="#FFCE44">已删除</a-tag>
    </template>

    <!--    课程分类显示的模板-->
    <template slot="courseCategories" slot-scope="courseCategories">
      <a-tag
        style="margin: 5px"
        v-for="courseCategory in courseCategories"
        :key="courseCategory.id"
        color="blue"
        >{{ courseCategory.courseCategoryName }}</a-tag
      >
    </template>

    <!--    操作模板-->
    <template slot="action" slot-scope="text, record, index">
      <a-button v-if="isAdmin()" type="primary" @click="actionClick(index)"
        >编辑</a-button
      >
      <a-button v-if="isStudent()" @click="courseSelect(record)">选课</a-button>
      <a-button v-if="isStudent()" type="danger" @click="courseUnSelect(record)"
        >退选</a-button
      >
    </template>

    <!--      搜索筛选-->
    <div
      slot="filterDropdown"
      slot-scope="{
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        column,
      }"
      style="padding: 8px"
    >
      <a-input
        v-ant-ref="(c) => (searchInput = c)"
        :placeholder="`输入要搜索的关键字`"
        :value="selectedKeys[0]"
        style="width: 188px; margin-bottom: 8px; display: block"
        @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
        @pressEnter="
          () => handleSearch(selectedKeys, confirm, column.dataIndex)
        "
      />
      <a-button
        type="primary"
        icon="search"
        size="small"
        style="width: 90px; margin-right: 8px"
        @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
      >
        搜索
      </a-button>
      <a-button
        size="small"
        style="width: 90px"
        @click="() => handleReset(clearFilters)"
      >
        重置
      </a-button>
    </div>

    <!--      搜索图标-->
    <a-icon
      slot="filterIcon"
      slot-scope="filtered"
      type="search"
      :style="{ color: filtered ? '#108ee9' : undefined }"
    />

    <!--      搜索结果高亮展示-->
    <template slot="customRender" slot-scope="text, record, index, column">
      <span v-if="searchText && searchedColumn === column.dataIndex">
        <template
          v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
        >
          <mark
            v-if="fragment.toLowerCase() === searchText.toLowerCase()"
            :key="i"
            class="highlight"
            >{{ fragment }}</mark
          >
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
      <template v-else>
        {{ text }}
      </template>
    </template>
  </a-table>
</template>

<script>
import { getCookie } from "common/cookie";
import {selectCourse, unselectCourse} from 'network/course';
import responseCode from "network/responseCode";

export default {
  name: "CourseTable",
  props: {
    currentPage: {
      type: Number,
      default: 0,
    },
    totalPage: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    schoolFilters: {
      type: Array,
      default: () => {
        return [];
      },
    },
    courseCategoryFilters: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      searchText: "",
      searchInput: null,
      searchedColumn: "",
      filteredInfo: null,
    };
  },
  computed: {
    //获取表头
    getColumns() {
      let { filteredInfo, courseCategoryFilters } = this;
      filteredInfo = filteredInfo || {};
      let columns = [
        {
          title: "ID",
          dataIndex: "id",
          // fixed: 'left',
          width: "80px",
          align: "center",
          sorter: (a, b) => a.id - b.id,
          scopedSlots: { customRender: "id" },
        },
        {
          title: "课程名",
          align: "center",
          dataIndex: "courseName",
          key: "courseName",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.courseName
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
        },
        {
          title: "课程描述",
          align: "center",
          dataIndex: "courseDescription",
          ellipsis: true,
        },
        {
          title: "上课教室",
          align: "center",
          dataIndex: "classroom",
        },
        {
          title: "周学时",
          align: "center",
          dataIndex: "weeklySchoolHour",
          width: "80px",
        },
        {
          title: "课程容量",
          align: "center",
          dataIndex: "maxSelectedNum",
          width: "120px",
        },
        {
          title: "学分",
          align: "center",
          dataIndex: "score",
          width: "80px",
        },
        {
          title: "学分类型",
          align: "center",
          dataIndex: "scoreType.scoreTypeName",
          ellipsis: true,
        },
        {
          title: "课程分类",
          dataIndex: "courseCategories",
          scopedSlots: { customRender: "courseCategories" },
          filters: courseCategoryFilters,
          filteredValue: filteredInfo.courseCategories || null,
          onFilter: (value, record) =>
            JSON.stringify(record).indexOf(value) > 0,
        },
        {
          title: "任课教师",
          align: "center",
          dataIndex: "teacher.realName",
        },
        {
          title: "开课学院",
          align: "center",
          dataIndex: "academy.academyName",
          ellipsis: true,
        },
        {
          title: "状态",
          dataIndex: "isDelete",
          align: "center",
          scopedSlots: { customRender: "isDelete" },
          sorter: (a, b) => a.isDelete - b.isDelete,
          filters: [
            { text: "正常", value: "UNDELETED" },
            { text: "已删除", value: "DELETED" },
          ],
          filteredValue: filteredInfo.isDelete || null,
          onFilter: (value, record) => value == record.isDelete,
        },
      ];
      if (this.isStudent() || this.isAdmin()) {
        columns.push({
          title: "操作",
          align: "center",
          width: "300px",
          // fixed: 'right',
          scopedSlots: { customRender: "action" },
        });
      }
      return columns;
    },
  },
  methods: {
    isAdmin() {
      return getCookie("loginType") === "2";
    },
    isStudent() {
      return getCookie("loginType") === "0";
    },
    // 编辑按钮点击
    actionClick(index) {
      this.$emit("actionClick", index);
    },
    // 选课按钮点击
    courseSelect(record) {
      this.$confirm({
        title: "确定选择该课程吗?",
        onOk() {
          selectCourse(getCookie("id"), record.id)
          .then((res) => {
              if (res.code === 20000) {
                alert('选课成功！');
              } else {
                alert('选课失败！');
              }
            })
            .catch((err) => {
              alert('选课失败！');
            });
        },
        onCancel() {
          // doNothing
        },
      });
    },
    // 退选按钮点击
    courseUnSelect(record) {
      this.$confirm({
        title: "确定取消选择该课程吗?",
        okType: "danger",
        onOk() {
          unselectCourse(getCookie('id'), record.id)
          .then((res) => {
              if (res.code === 20000) {
                alert('退课成功！');
              } else {
                alert('退课失败！');
              }
            })
            .catch((err) => {
              alert('退课失败！');
            });
        },
        onCancel() {
          // doNothing
        },
      });
    },
    // 表格发生变化
    handleTableChange(pagination, filters, sorter) {
      this.filteredInfo = filters;
      if (this.currentPage != pagination.current) {
        //判断页码是否发生变化，是否是在翻页
        this.$emit("change", pagination.current);
      }
    },
    //筛选搜索
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      console.log(selectedKeys);
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    //搜索筛选重置
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },
  },
};
</script>

<style scoped>
.highlight {
  background: #1890ff;
  color: white;
}
</style>

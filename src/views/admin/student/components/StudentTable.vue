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

    <!-- 性别显示的模板 -->
    <template slot="gender" slot-scope="gender">
      <span v-if="gender === 'MALE'">男</span>
      <span v-else-if="gender === 'FEMALE'">女</span>
    </template>


    <!--    操作模板-->
    <template slot="action" slot-scope="text, record, index">
      <a-button type="primary" @click="actionClick(index)">编辑</a-button>
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
import { getCookie } from '../../../../common/cookie';
export default {
  name: "StudentTable",
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
      let { filteredInfo } = this;
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
          title: "学号",
          dataIndex: "account",
          align: "center",
          sorter: (a, b) => a.account - b.account,
        },
        {
          title: "学生姓名",
          dataIndex: "realName",
          align: "center",
          sorter: (a, b) => a.realName - b.realName,
        },
        {
          title: "手机号",
          dataIndex: "phoneNumber",
          align: "center",
          sorter: (a, b) => a.phoneNumber - b.phoneNumber,
        },
        {
          title: "邮箱地址",
          dataIndex: "email",
          align: "center",
          sorter: (a, b) => a.email - b.email,
          ellipsis: true
        },
        {
          title: "性别",
          dataIndex: "gender",
          align: "center",
          sorter: (a, b) => a.gender - b.gender,
          scopedSlots: { customRender: "gender" }
        },
        {
          title: "身份证号",
          dataIndex: "idCardNo",
          align: "center",
          sorter: (a, b) => a.idCardNo - b.idCardNo,
          ellipsis: true
        },
        {
          title: "入学日期",
          dataIndex: "enrollmentDate",
          align: "center",
        },
        {
          title: "班级",
          dataIndex: "classNo",
          align: "center",
          sorter: (a, b) => a.classNo - b.classNo,
        },
        {
          title: "专业",
          align: "center",
          width: "120px",
          dataIndex: "major.majorName",
          key: "majorName",
          ellipsis: true,
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.majorName
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
          ellipsis: true
        },
        {
          title: "学院",
          dataIndex: "academy.academyName",
          align: "center",
          ellipsis: true
        },
        {
          title: "学校",
          dataIndex: "school.schoolName",
          align: "center",
          ellipsis: true
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
          // fixed: 'right',
          scopedSlots: { customRender: "action" },
        });
      }
      return columns;
    },
  },
  methods: {
    isStudent() {
      return getCookie('loginType') === '0';
    },
    isAdmin() {
      return getCookie('loginType') === '2';
    },
    // 操作按钮点击
    actionClick(index) {
      this.$emit("actionClick", index);
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

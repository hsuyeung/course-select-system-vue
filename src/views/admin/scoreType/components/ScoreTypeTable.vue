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
export default {
  name: "ScoreTypeTable",
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
      const columns = [
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
          title: "学分类型名",
          align: "center",
          dataIndex: "scoreTypeName",
          key: "scoreTypeName",
          ellipsis: true,
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "customRender",
          },
          onFilter: (value, record) =>
            record.scoreTypeName
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
          title: "毕业所需学分",
          align: "center",
          dataIndex: "requiredScore",
          ellipsis: true
        },
        {
          title: "所属学校",
          align: "center",
          ellipsis: true,
          dataIndex: "school.schoolName"
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
        {
          title: "操作",
          align: "center",
          // fixed: 'right',
          scopedSlots: { customRender: "action" },
        },
      ];

      return columns;
    },
  },
  methods: {
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

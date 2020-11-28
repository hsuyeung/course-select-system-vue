<template>
  <a-table
    :columns="getColumns"
    :row-key="record => record.id"
    :data-source="data"
    :pagination="{total:totalPage}"
    :loading="loading"
    bordered
    @change="handleTableChange"
  >
    <!--    id显示的模板-->
    <template slot="id" slot-scope="id">
      <div style="font-weight: bold">
        {{id}}
      </div>
    </template>
    <!--    权限显示的模板-->
    <template slot="tags" slot-scope="tags">
      <a-tag style="margin: 5px" v-for="tag in tags" :key="tag.id" color="blue">{{tag.tagName }}</a-tag>
    </template>

    <!--    状态显示的模板-->
    <template slot="status" slot-scope="status">
      <a-tag v-if="status===0" color="#1890FF">正常</a-tag>
      <a-tag v-else-if="status===1" color="#DD5145">删除</a-tag>
      <a-tag v-else-if="status===2" color="#FFCE44">审核中</a-tag>
      <a-tag v-else color="#DD5145">审核失败</a-tag>
    </template>

    <!--    操作模板-->
    <template slot="action" slot-scope="text, record, index">
      <a-button type="primary" @click="actionClick(index)">编辑</a-button>
    </template>


    <!--      搜索筛选-->
    <div
      slot="filterDropdown"
      slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
      style="padding: 8px"
    >
      <a-input
        v-ant-ref="c => (searchInput = c)"
        :placeholder="`输入要搜索的 ${column.dataIndex}`"
        :value="selectedKeys[0]"
        style="width: 188px; margin-bottom: 8px; display: block;"
        @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
        @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
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
      <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
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
            >{{ fragment }}</mark>
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
    name: "ArticleTable",
    props: {
      "currentPage": {
        type: Number,
        default: 0
      },
      "totalPage": {
        type: Number,
        default: 0
      },
      "loading": {
        type: Boolean,
        default: false
      },
      "data": {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        searchText: '',
        searchInput: null,
        searchedColumn: '',
        filteredInfo: null
      }

    },
    computed: {
      //获取表头
      getColumns() {
        let {filteredInfo} = this;
        filteredInfo = filteredInfo || {};
        const columns = [
          {
            title: 'ID',
            dataIndex: 'id',
            // fixed: 'left',
            width: '80px',
            align: 'center',
            sorter: (a, b) => a.id - b.id,
            scopedSlots: {customRender: 'id'}
          },
          {
            title: '权重',
            align: 'center',
            width: '120px',
            dataIndex: 'sequence',
            key: 'username',
            ellipsis: true,
            sorter: (a, b) => a.sequence - b.sequence,
          },
          {
            title: '标题',
            width: '180px',
            dataIndex: 'title',
            align: 'center',
            ellipsis: true,
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender',
            },
            onFilter: (value, record) =>
              record.title
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus();
                }, 0);
              }
            },
          },
          {
            title: '描述',
            width: '180px',
            dataIndex: 'description',
            align: 'center',
            ellipsis: true,
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender',
            },
            onFilter: (value, record) =>
              record.description
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus();
                }, 0);
              }
            },
          },
          {
            title: '分类',
            dataIndex: 'category.categoryName',
            width: "150px",
            align: 'center',
            ellipsis: true,
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender',
            },
            onFilter: (value, record) =>
              record.categoryName
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus();
                }, 0);
              }
            },
          },
          {
            title: '标签',
            dataIndex: 'tags',
            width: "400px",
            align: 'center',
            scopedSlots: {customRender: 'tags'},
          },
          {
            title: '创建者',
            width: '180px',
            dataIndex: 'creator',
            align: 'center',
            ellipsis: true,
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'filterIcon',
              customRender: 'customRender',
            },
            onFilter: (value, record) =>
              record.creator
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  this.searchInput.focus();
                }, 0);
              }
            },
          },
          {
            title: "创建时间",
            dataIndex: "createTime",
            width: "180px",
            align: 'center',
          },
          {
            title: "状态",
            dataIndex: "status",
            width: '100px',
            align: 'center',
            scopedSlots: {customRender: 'status'},
            filters: [
              {text: '正常', value: '0'},
              {text: '删除', value: '1'},
              {text: '审核中', value: '2'},
              {text: '审核失败', value: '3'},
            ],
            filteredValue: filteredInfo.status || null,
            onFilter: (value, record) => value == record.status,
          },
          {
            title: "操作",
            width: "100px",
            align: 'center',
            scopedSlots: {customRender: 'action'}
          }
        ];

        return columns;

      }
    },
    methods: {
      // 操作按钮点击
      actionClick(index) {
        this.$emit('actionClick', index)
      },
      // 表格发生变化
      handleTableChange(pagination, filters, sorter) {
        this.filteredInfo = filters;
        if (this.currentPage != pagination.current) {//判断页码是否发生变化，是否是在翻页
          this.$emit('change', pagination.current)
        }
      },
      //筛选搜索
      handleSearch(selectedKeys, confirm, dataIndex) {
        confirm();
        console.log(selectedKeys)
        this.searchText = selectedKeys[0];
        this.searchedColumn = dataIndex;
      },

      //搜索筛选重置
      handleReset(clearFilters) {
        clearFilters();
        this.searchText = '';
      },
    }


  }
</script>

<style scoped>
  .highlight {
    background: #1890FF;
    color: white;
  }
</style>

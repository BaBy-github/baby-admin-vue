<template>
  <div class="container">
    <Breadcrumb :items="['menu.server.system', 'menu.server.system.menu']" />
    <a-card class="general-card" :title="$t('menu.server.system.menu')">
      <a-row>
        <!--查询表单-->
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="id"
                  :label="$t('menuSearch.searchTable.form.id')"
                >
                  <a-input-number
                    v-model="formModel.id"
                    :placeholder="
                      $t('menuSearch.searchTable.form.id.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="name"
                  :label="$t('menuSearch.searchTable.form.name')"
                >
                  <a-input
                    v-model="formModel.name"
                    :placeholder="
                      $t('menuSearch.searchTable.form.name.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="name"
                  :label="$t('menuSearch.searchTable.form.parentId')"
                >
                  <a-input-number
                    v-model="formModel.parentId"
                    :placeholder="
                      $t('menuSearch.searchTable.form.parentId.placeholder')
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('menuSearch.searchTable.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('menuSearch.searchTable.form.status.-1')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <!--查询表单按钮-->
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('menuSearch.searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('menuSearch.searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <!-- 批量处理-->
      <a-row style="margin-bottom: 16px">
        <a-col :span="16">
          <a-space>
            <!--            <a-button type="primary">-->
            <!--              <template #icon>-->
            <!--                <icon-plus />-->
            <!--              </template>-->
            <!--              {{ $t('menuSearch.searchTable.operation.create') }}-->
            <!--            </a-button>-->
            <!--            <a-upload action="/">-->
            <!--              <template #upload-button>-->
            <!--                <a-button>-->
            <!--                  {{ $t('menuSearch.searchTable.operation.import') }}-->
            <!--                </a-button>-->
            <!--              </template>-->
            <!--            </a-upload>-->
          </a-space>
        </a-col>
        <a-col :span="8" style="text-align: right">
          <!--          <a-button>-->
          <!--            <template #icon>-->
          <!--              <icon-download />-->
          <!--            </template>-->
          <!--            {{ $t('searchTable.operation.download') }}-->
          <!--          </a-button>-->
        </a-col>
      </a-row>
      <!-- 数据列表-->
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        @sorter-change="onSorterChange"
      >
        <template #columns>
          <!-- menu id-->
          <a-table-column
            :sortable="{ sortDirections: ['ascend', 'descend'] }"
            :title="$t('menuSearch.searchTable.columns.id')"
            data-index="id"
          />
          <!-- menu name名称-->
          <a-table-column
            :title="$t('menuSearch.searchTable.columns.name')"
            data-index="name"
          />
          <!-- metaStr-->
          <a-table-column
            :title="$t('menuSearch.searchTable.columns.metaStr')"
            data-index="metaStr"
          />
          <!-- parentId-->
          <a-table-column
            :sortable="{ sortDirections: ['ascend', 'descend'] }"
            :title="$t('menuSearch.searchTable.columns.parentId')"
            data-index="parentId"
          />
          <!-- status-->
          <a-table-column
            :title="$t('menuSearch.searchTable.columns.status')"
            data-index="status"
          >
            <template #cell="{ record }">
              <span v-if="record.status === '0'" class="circle"></span>
              <span v-else class="circle pass"></span>
              {{ $t(`menuSearch.searchTable.form.status.${record.status}`) }}
            </template>
          </a-table-column>
          <!-- operations-->
          <a-table-column
            :title="$t('menuSearch.searchTable.columns.operations')"
            data-index="operations"
          >
            <template #cell>
              <a-button v-permission="['admin']" type="text" size="small">
                {{ $t('menuSearch.searchTable.columns.operations.view') }}
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { queryMenuList, MenuRecord, MenuParams } from '@/api/menu';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';

  // 初始化查询表单信息
  const generateFormModel = () => {
    return {
      id: null,
      name: null,
      parentId: null,
      status: null,
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<MenuRecord[]>([]);
  const formModel = ref(generateFormModel());
  const basePagination: Pagination = {
    showTotal: true,
    total: 0,
    current: 1,
    showPageSize: true,
    pageSize: 5,
    pageSizeOptions: [5, 10, 15, 20],
    showJumper: true,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('menuSearch.searchTable.form.status.1'),
      value: '1',
    },
    {
      label: t('menuSearch.searchTable.form.status.0'),
      value: '0',
    },
    {
      label: t('menuSearch.searchTable.form.status.-1'),
      value: '-1',
    },
  ]);
  // 拉取数据方法
  const fetchData = async (params: MenuParams = fetchDataParams()) => {
    setLoading(true);
    try {
      const { data } = await queryMenuList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.totalCount;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  // fetchData查询参数
  const fetchDataParams = () => {
    const params: MenuParams = {
      orderInfoMap,
      current: pagination.current,
      pageSize: pagination.pageSize,
    };
    // 查询条件
    if (formModel.value.id !== null) {
      params.id = formModel.value.id;
    }
    if (formModel.value.name !== null) {
      params.name = formModel.value.name;
    }
    if (formModel.value.parentId !== null) {
      params.parentId = formModel.value.parentId;
    }
    if (formModel.value.status !== null) {
      params.status = formModel.value.status;
    }
    // 排序
    return params;
  };
  // 查询按钮点击事件
  const search = () => {
    fetchData({
      ...fetchDataParams(),
    } as unknown as MenuParams);
  };
  // 排序
  const orderInfoMap: Record<string, any> = {};
  const onSorterChange = (column: string, key: string) => {
    orderInfoMap[column] = key;
    fetchData({
      ...fetchDataParams(),
    });
  };
  // 分页
  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData({
      ...fetchDataParams(),
      current,
    });
  };
  // 分页大小改变
  const onPageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    fetchData({
      ...fetchDataParams(),
      pageSize,
    });
  };
  // 执行拉取数据
  fetchData();
  // 重置查询表单
  const reset = () => {
    formModel.value = generateFormModel();
  };
</script>

<script lang="ts">
  export default {
    name: 'Menu',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
</style>

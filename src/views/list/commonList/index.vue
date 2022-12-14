<template>
  <n-space
    vertical
    size="large"
  >
    <n-card>
      <n-form
        ref="formRef"
        :model="model"
        label-placement="left"
        :show-feedback="false"
      >
        <n-grid
          :x-gap="30"
          :cols="18"
        >
          <n-form-item-gi
            :span="4"
            label="姓名"
            path="condition_1"
          >
            <n-input
              v-model:value="model.condition_1"
              placeholder="请输入"
            />
          </n-form-item-gi>
          <n-form-item-gi
            :span="4"
            label="年龄"
            path="condition_2"
          >
            <n-input
              v-model:value="model.condition_2"
              placeholder="请输入"
            />
          </n-form-item-gi>
          <n-form-item-gi
            :span="4"
            label="性别"
            path="condition_3"
          >
            <n-input
              v-model:value="model.condition_3"
              placeholder="请输入"
            />
          </n-form-item-gi>
          <n-form-item-gi
            :span="4"
            label="地址"
            path="condition_4"
          >
            <n-input
              v-model:value="model.condition_4"
              placeholder="请输入"
            />
          </n-form-item-gi>
          <n-gi :span="1">
            <n-button type="primary">
              <template #icon>
                <i-icon-park-outline-search />
              </template>
              搜索
            </n-button>
          </n-gi>
          <n-gi :span="1">
            <n-button
              strong
              secondary
              @click="handleResetSearch"
            >
              <template #icon>
                <i-icon-park-outline-redo />
              </template>
              重置
            </n-button>
          </n-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-card>
      <n-space
        vertical
        size="large"
      >
        <div class="flex gap-4">
          <n-button
            type="primary"
            @click="handleAddTable"
          >
            <template #icon>
              <i-icon-park-outline-add-one />
            </template>
            新建
          </n-button>
          <n-button
            strong
            secondary
          >
            <template #icon>
              <i-icon-park-outline-afferent />
            </template>
            批量导入
          </n-button>
          <n-button
            strong
            secondary
            class="ml-a"
          >
            <template #icon>
              <i-icon-park-outline-download />
            </template>
            下载
          </n-button>
        </div>
        <n-data-table
          :columns="columns"
          :data="listData"
          :loading="loading"
        />
        <Pagination
          :count="100"
          @change="changePage"
        />
        <TableModal
          v-model:visible="visible"
          :type="modalType"
          :modal-data="editData"
        />
      </n-space>
    </n-card>
  </n-space>
</template>

<script setup lang="tsx">
import { onMounted, ref, h } from 'vue';
import { fetchUserList } from '@/service';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NPopconfirm, NSpace, NSwitch, NTag, FormInst } from 'naive-ui';
import { useLoading, useBoolean } from '@/hooks';
import TableModal from './components/TableModal.vue';

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean(false);

const initialModel = { condition_1: '', condition_2: '', condition_3: '', condition_4: '' };
const model = ref({ ...initialModel });

const formRef = ref<FormInst | null>();
const columns: DataTableColumns = [
	{
		title: '姓名',
		align: 'center',
		key: 'name',
	},
	{
		title: '年龄',
		align: 'center',
		key: 'age',
	},
	{
		title: '性别',
		align: 'center',
		key: 'gender',
		render: (row) => {
			const rowData = row as unknown as CommonList.UserList;
			const tagType = {
				'0': {
					label: '女',
					type: 'primary',
				},
				'1': {
					label: '男',
					type: 'success',
				},
			} as const;
			if (rowData.gender) {
				return <NTag type={tagType[rowData.gender].type}>{tagType[rowData.gender].label}</NTag>;
			}
		},
	},
	{
		title: '邮箱',
		align: 'center',
		key: 'email',
	},
	{
		title: '地址',
		align: 'center',
		key: 'address',
	},
	{
		title: '角色',
		align: 'center',
		key: 'role',
		render: (row) => {
			const rowData = row as unknown as CommonList.UserList;
			const tagType = {
				super: 'primary',
				admin: 'warning',
				user: 'success',
			} as const;
			return <NTag type={tagType[rowData.role]}>{rowData.role}</NTag>;
		},
	},
	{
		title: '状态',
		align: 'center',
		key: 'disabled',
		render: (row) => {
			const rowData = row as unknown as CommonList.UserList;

			return (
				<NSwitch value={rowData.disabled} onUpdateValue={(disabled) => handleUpdateDisabled(disabled, rowData.id)}>
					{{ checked: () => '启用', unchecked: () => '禁用' }}
				</NSwitch>
			);
		},
	},
	{
		title: '操作',
		align: 'center',
		key: 'actions',
		render: (row) => {
			const rowData = row as unknown as CommonList.UserList;
			return (
				<NSpace justify={'center'}>
					<NButton size={'small'} onClick={() => handleEditTable(rowData)}>
						编辑
					</NButton>
					<NPopconfirm onPositiveClick={() => sendMail(rowData.id)}>
						{{
							default: () => '确认删除',
							trigger: () => <NButton size={'small'}>删除</NButton>,
						}}
					</NPopconfirm>
				</NSpace>
			);
		},
	},
];
const sendMail = (id: number) => {
	window.$message.success(`用户id:${id}`);
};
function handleUpdateDisabled(disabled: boolean, id: number) {
	const index = listData.value.findIndex((item) => item.id === id);
	if (index > -1) {
		listData.value[index].disabled = disabled;
	}
}

const listData = ref<CommonList.UserList[]>([]);

onMounted(() => {
	getUserList();
});
async function getUserList() {
	startLoading();
	await fetchUserList().then((res) => {
		listData.value = res.data;
		endLoading();
	});
}
function changePage(page: number, size: number) {
	window.$message.success(`分页器:${page},${size}`);
}
function handleResetSearch() {
	model.value = { ...initialModel };
}

type ModalType = 'add' | 'edit';
const modalType = ref<ModalType>('add');
function setModalType(type: ModalType) {
	modalType.value = type;
}

const editData = ref<CommonList.UserList | null>(null);
function setEditData(data: CommonList.UserList | null) {
	editData.value = data;
}

function handleEditTable(rowData: CommonList.UserList) {
	setEditData(rowData);
	setModalType('edit');
	openModal();
}
function handleAddTable() {
	openModal();
	setModalType('add');
}
</script>

<style scoped></style>

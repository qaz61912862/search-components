<template>
  <search-area
    v-model="params"
    :showLength="2"
    :config="config"
    @handleSearch="handleSearch"
    @handleReset="handleReset"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SearchArea from '@/components/searchArea';

interface IParams {
  name: string;
  area: string;
  favorite: string;
  startTime: string;
  endTime: string;
  distributeStartTime: string;
  distributeEndTime: string;
}

export default defineComponent({
  name: 'Home',
  components: {
    SearchArea,
  },
  setup() {
    const params = ref<IParams>({
      name: '',
      area: '',
      favorite: '',
      startTime: '',
      endTime: '',
      distributeStartTime: '',
      distributeEndTime: '',
    });
    const handleSearch = () => {
      console.log(params.value);
    };
    const handleReset = () => {
      params.value.name = '';
      params.value.area = '';
      params.value.favorite = '';
      params.value.startTime = '';
      params.value.endTime = '';
      params.value.distributeStartTime = '';
      params.value.distributeEndTime = '';
    };
    return {
      params,
      config: [
        {
          name: '姓名',
          component: 'input',
          valueName: 'name',
          placeholder: '请输入姓名',
        },
        {
          name: '地区',
          component: 'select',
          valueName: 'area',
          placeholder: '请选择地区',
          options: [
            {
              id: 'gz',
              name: '广州',
            },
            {
              id: 'sz',
              name: '深圳'
            },
          ],
          optionLabel: 'name',
          optionValue: 'id',
        },
        {
          name: '爱好',
          component: 'input',
          valueName: 'favorite',
          placeholder: '请输入爱好',
        },
        {
          name: '创建日期',
          component: 'datePicker',
          valueName: ['startTime', 'endTime'],
          placeholder: ['开始时间', '结束时间'],
        },
        {
          name: '分配日期',
          component: 'datePicker',
          valueName: ['distributeStartTime', 'distributeEndTime'],
          placeholder: ['开始时间', '结束时间'],
        },
      ],
      handleSearch,
      handleReset,
    }
  },
});
</script>

<style lang="scss">
.el-select{
  width: 100%;
}
</style>

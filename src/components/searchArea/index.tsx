import { defineComponent, PropType, ref, reactive, computed, ComputedRef, Ref } from "vue";
import { IConfigItem } from './types';

export default defineComponent({
  props: {
    // 传入的配置项
    config: {
      type: Array as PropType<IConfigItem[]>,
      required: true,
    },
    // 传入的v-model值
    modelValue: {
      type: Object,
      required: true,
    },
    // 默认显示的数量
    showLength: {
      type: Number,
      default: 2,
    },
  },
  emits: ['update:modelValue', 'handleSearch', 'handleReset'],
  setup(props, { emit }) {
    // 控制展开收起
    const isOpen = ref(false);
    // 点击展开/收起
    const handleOpenRetract = () => {
      isOpen.value = !isOpen.value;
    };
    // 更新值
    const updateValue = (value: string | string[], item: IConfigItem) => {
      console.log(value, item);
      if (['input', 'select'].includes(item.component ?? '')) {
        emit('update:modelValue', {
          ...props.modelValue,
          [item.valueName as string]: value,
        });
      }
    };
    // 存日期
    const dateValues = reactive<{
      [key: string]: ComputedRef<Ref<string[]>>
    }>({});
    // 处理传入的modelValue作为日期组件的值
    const handleDateValues = () => {
      props.config.forEach((each) => {
        if (each.component === 'datePicker') {
          dateValues[each.valueName![0]] = computed({
            get() {
              return [props.modelValue?.[each.valueName![0]], props.modelValue?.[each.valueName![1]]];
            },
            set(value: string[]) {
              emit('update:modelValue', {
                ...props.modelValue,
                [(each.valueName as string[])?.[0]]: value?.[0],
                [(each.valueName as string[])?.[1]]: value?.[1],
              });
            }
          });
        }
      })
    };
    handleDateValues();
    return {
      isOpen,
      dateValues,
      handleOpenRetract,
      updateValue,
      defaultTime: [
        new Date(2000, 1, 1, 0, 0, 0),
        new Date(2000, 2, 1, 23, 59, 59),
      ],
    }
  },
  render() {
    const renderInput = (item: IConfigItem) => {
      // component为input时渲染el-input组件
      return item.component === 'input' ? (
        // 传入一些常用的属性，原生属性通过展开item传入，定义v-model
        // 触发input事件时，更新外部params
        <el-input
          placeholder="请输入"
          clearable={true}
          {...item}
          v-model={this.modelValue[item.valueName! as string]}
          onInput={(value: string) => {
            const _value = value.trim();
            this.updateValue(_value, item);
          }}
        />
      ) : null;
    };
    const renderSelect = (item: IConfigItem) => {
      // component为select时渲染el-select组件
      return item.component === 'select' ? (
        // 传入一些常用的属性，原生属性通过展开item传入，定义v-model
        // 触发change事件时，更新外部params
        <el-select
          placeholder="请选择"
          clearable={true}
          {...item}
          v-model={this.modelValue[item.valueName! as string]}
          onChange={(value: string) => {
            this.updateValue(value, item);
          }}
        >
          {
            item.options?.map((it) => {
              return (
                <el-option
                  // 通过传入label和value字段名的配置
                  label={it[item.optionLabel ?? 'label']}
                  value={it[item.optionValue ?? 'value']}
                />
              );
            })
          }
        </el-select>
      ) : null;
    };
    const renderDatePicker = (item: IConfigItem) => {
      return item.component === 'datePicker' ? (
        <el-date-picker
          v-model={this.dateValues[item.valueName![0]]}
          type="daterange"
          range-separator="至"
          clearable={true}
          start-placeholder={item?.placeholder?.[0] ?? '开始日期'}
          end-placeholder={item?.placeholder?.[1] ?? '结束日期'}
          value-format="YYYY-MM-DD HH:mm:ss"
          default-time={this.defaultTime}
          onChange={(value: string[]) => {
            this.updateValue(value, item);
          }}
        />
      ) : null;
    };
    return (
      <el-form
        label-width="96px"
        size="small"
        label-position="right"
      >
        {JSON.stringify(this.modelValue)}
        <el-row>
          {
            this.config.map((item: IConfigItem, index: number) => {
              return (
                <el-col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={8}
                  xl={6}
                  v-show={index < this.showLength || (index >= this.showLength && this.isOpen)}
                >
                  {/* 存放每一个config项生成的小组件 */}
                  <el-form-item label={item.name} label-width="96px">
                    {renderInput(item)}
                    {renderSelect(item)}
                    {renderDatePicker(item)}
                  </el-form-item>
                </el-col>
              )
            })
          }
          <el-col
            xs={24}
            sm={12}
            md={8}
            lg={8}
            xl={6}
            class="margin-bottom-15 padding-left-20">
            <el-button
              size="small"
              class="margin-left-20"
              type="primary"
              onClick={() => {
                this.$emit('handleSearch');
              }}
            >查询</el-button>
            <el-button
              size="small"
              onClick={() => {
                this.$emit('handleReset');
              }}
            >重置</el-button>
            {
              this.config.length > this.showLength && (
                <el-button
                  size="small"
                  class="margin-left-20"
                  onClick={this.handleOpenRetract}
                >
                  {this.isOpen ? '收起' : '展开'}
                  <i class={`el-icon-arrow-${this.isOpen ? 'up' : 'down'}`}></i>
                </el-button>
              )
            }
          </el-col>
        </el-row>
      </el-form>
    )
  }
})
## API

| 属性名称           | 类型`(默认值)`                               | 描述                                 |
| ------------------ | -------------------------------------------- | ------------------------------------ |
| classPrefix        | string `('rs-picker-cascader')`              | className 前缀                       |
| data               | array                                        | 组件数据                             |
| disabled           | boolean                                      | 禁用组件                             |
| disabledItemValues | array                                        | 禁用选项                             |
| groupBy            | string                                       | 设置分组条件在 `data` 中的 `key`     |
| valueKey           | string `('value')`                           | 设置选项值在 `data` 中的 `key`       |
| labelKey           | string `('label')`                           | 设置选项显示内容在 `data` 中的 `key` |
| childrenKey        | string `('children')`                        | 设置选项子节点在 `data` 中的 `key`   |
| value              | any                                          | 设置值（受控）                       |
| defaultValue       | any                                          | 设置默认值                           |
| onChange           | (value:any, event)=>void                     | `value` 发生改变时的回调函数         |
| onSelect           | (value:any, item: Object , event)=>void      | 选项被点击选择后的回调函数           |
| onSearch           | (searchKeyword:string, event)=>void          | 搜索的回调函数                       |
| onOpen             | ()=>void                                     | 打开回调函数                         |
| onClose            | ()=>void                                     | 关闭回调函数                         |
| onGroupTitleClick  | (event)=>void                                | 点击分组标题的回调函数               |
| placeholder        | React.Node `('Select')`                      | 占位符                               |
| renderValue        | (label:React.Node, item: Object)=>React.Node | 自定义被选中的选项                   |
| renderMenuItem     | (label:React.Node, item: Object)=>React.Node | 自定义选项                           |
| cleanable          | boolean `(true)`                             | 可以清除                             |
| open               | boolean                                      | 打开 (受控)                          |
| defaultOpen        | boolean                                      | 默认打开                             |
| placement          | enum: Placement`('bottomLeft')`              | 打开位置                             |
| menuWidth          | number `(120)`                               | 菜单的宽度                           |
| menuHeight         | number `(200)`                               | 菜单的高度                           |

### Enums & Unions

```js
Type Placement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom';
```
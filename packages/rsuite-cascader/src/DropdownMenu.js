// @flow

import * as React from 'react';
import { getPosition, scrollTop } from 'dom-lib';
import _ from 'lodash';
import classNames from 'classnames';

import { getUnhandledProps, prefix } from 'rsuite-utils/lib/utils';
import { namespace } from 'rsuite-utils/lib/Picker/constants';

import stringToObject from './utils/stringToObject';
import DropdownMenuItem from './DropdownMenuItem';

type DefaultEvent = SyntheticEvent<*>;
type Props = {
  classPrefix: string,
  data: Array<any>,
  disabledItemValues: Array<any>,
  activeItemValue?: any,
  childrenKey: string,
  valueKey: string,
  labelKey: string,
  menuWidth: number,
  menuHeight: number,
  className?: string,
  renderMenuItem?: (itemLabel: React.Node, item: Object) => React.Node,
  renderMenu?: (itemLabel: React.Node, item: Object, parentNode: Object) => React.Node,
  onSelect?: (node: any, activePaths: Array<any>, isLeafNode: boolean, event: DefaultEvent) => void,

  cascadeItems: Array<any>,
  cascadePathItems: Array<any>
};

type States = {
  cascadeItems: Array<any>,
  cascadePathItems: Array<any>
};

class DropdownMenu extends React.Component<Props, States> {
  static defaultProps = {
    classPrefix: `${namespace}-cascader-menu-items`,
    data: [],
    disabledItemValues: [],
    cascadeItems: [],
    cascadePathItems: [],
    menuWidth: 120,
    menuHeight: 200,
    childrenKey: 'children',
    valueKey: 'value',
    labelKey: 'label'
  };

  static handledProps = [];

  constructor(props: Props) {
    super(props);
    const { cascadeItems, cascadePathItems } = props;
    this.state = {
      cascadeItems,
      cascadePathItems
    };
  }

  componentDidMount() {
    this.scrollToActiveItemTop();
  }

  componentWillReceiveProps(nextProps: Props) {
    const { cascadeItems, cascadePathItems } = nextProps;
    if (!_.isEqual(cascadeItems, this.props.cascadeItems)) {
      this.setState({ cascadeItems }, () => {
        this.scrollToActiveItemTop();
      });
    }

    if (!_.isEqual(cascadePathItems, this.props.cascadePathItems)) {
      this.setState({ cascadePathItems }, () => {
        this.scrollToActiveItemTop();
      });
    }
  }

  setCascadeCache(
    items: Array<any>,
    layer: number,
    node: any,
    isLeafNode: boolean,
    callback: Function
  ) {
    const { cascadeItems = [], cascadePathItems } = this.state;
    const nextItems = [];
    const nextPathItems = [];

    for (let i = 0; i < cascadeItems.length && i < layer; i += 1) {
      nextItems.push(cascadeItems[i]);
      if (i < layer - 1 && cascadePathItems) {
        nextPathItems.push(cascadePathItems[i]);
      }
    }

    nextPathItems.push(node);
    if (!isLeafNode) {
      nextItems.push(items);
    }

    this.setState(
      {
        cascadeItems: nextItems,
        cascadePathItems: nextPathItems
      },
      callback
    );
  }

  menus = [];

  handleSelect = (node: any, layer: number, index: number, event: DefaultEvent) => {
    const { onSelect, childrenKey } = this.props;
    const children = node[childrenKey];
    const isLeafNode = _.isUndefined(children) || _.isNull(children);

    const callback = () => {
      const { cascadePathItems = [] } = this.state;
      onSelect && onSelect(node, cascadePathItems, isLeafNode, event);
    };

    const items = (children || []).map(item => ({
      ...this.stringToObject(item),
      parent: node
    }));

    this.setCascadeCache(items, layer + 1, node, isLeafNode, callback);
  };

  stringToObject(value: any) {
    const { labelKey, valueKey } = this.props;
    return stringToObject(value, labelKey, valueKey);
  }

  scrollToActiveItemTop() {
    if (!this.menus) {
      return;
    }
    this.menus.forEach(menu => {
      if (!menu) {
        return;
      }

      let activeItem = menu.querySelector(`.${namespace}-cascader-menu-item-focus`);
      if (activeItem) {
        const position = getPosition(activeItem, menu);
        scrollTop(menu, position.top);
      }
    });
  }

  addPrefix = (name: string) => prefix(this.props.classPrefix)(name);

  menuBodyContainer = null;

  renderCascadeNode(node: any, index: number, layer: number, focus: boolean) {
    const {
      activeItemValue,
      valueKey,
      labelKey,
      childrenKey,
      disabledItemValues,
      renderMenuItem
    } = this.props;

    const children = node[childrenKey];
    const value = node[valueKey];
    const label = node[labelKey];

    const disabled = disabledItemValues.some(disabledValue => _.isEqual(disabledValue, value));

    // Use `value` in keys when If `value` is string or number
    const onlyKey = _.isString(value) || _.isNumber(value) ? value : index;

    return (
      <DropdownMenuItem
        getItemData={() => node}
        key={`${layer}-${onlyKey}`}
        disabled={disabled}
        active={!_.isUndefined(activeItemValue) && _.isEqual(activeItemValue, value)}
        focus={focus}
        value={node}
        className={children ? this.addPrefix('has-children') : undefined}
        onSelect={(itemData, event) => {
          this.handleSelect(itemData, layer, index, event);
        }}
      >
        {renderMenuItem ? renderMenuItem(label, node) : label}
        {children ? <span className={this.addPrefix('caret')} /> : null}
      </DropdownMenuItem>
    );
  }

  renderCascade() {
    const { cascadeItems = [], cascadePathItems } = this.state;
    const { menuWidth, menuHeight, valueKey, renderMenu } = this.props;

    const styles = {
      width: cascadeItems.length * menuWidth
    };

    const cascadeNodes = cascadeItems.map((children, layer) => {
      const onlyKey = `${layer}_${children.length}`;
      const menu = (
        <ul>
          {children.map((item, index) =>
            this.renderCascadeNode(
              item,
              index,
              layer,
              cascadePathItems[layer] &&
                _.isEqual(cascadePathItems[layer][valueKey], item[valueKey])
            )
          )}
        </ul>
      );

      const parentNode = cascadePathItems[layer - 1];
      const node = (
        <div
          key={onlyKey}
          className={this.addPrefix('column-menu')}
          ref={ref => {
            this.menus[layer] = ref;
          }}
          style={{
            height: menuHeight,
            width: menuWidth
          }}
        >
          {renderMenu ? renderMenu(children, menu, parentNode) : menu}
        </div>
      );
      return node;
    });
    return <div style={styles}>{cascadeNodes}</div>;
  }

  render() {
    const { className, classPrefix, ...rest } = this.props;

    const classes = classNames(classPrefix, className);
    const unhandled = getUnhandledProps(DropdownMenu, rest);

    return (
      <div
        {...unhandled}
        className={classes}
        ref={ref => {
          this.menuBodyContainer = ref;
        }}
      >
        {this.renderCascade()}
      </div>
    );
  }
}

export default DropdownMenu;
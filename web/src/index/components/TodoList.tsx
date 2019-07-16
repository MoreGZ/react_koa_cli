/**
 * 组件名
 * @author: georgemo
*/
import * as React from 'react';
import {
  Button, Input, List, Icon, Card, Row, Col,
} from 'antd';
import { Utils } from '@common/index';
import * as _ from 'lodash';

const { useState } = React;

export default function Component() {
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);

  function handleAddTodoItem() {
    const newList = list.concat([inputValue]);

    if (_.isEmpty(inputValue)) {
      return;
    }

    setList(newList);
    setInputValue('');
  }

  function handleRemoveTodoItem(index: number) {
    const newList = Utils.deepClone(list);
    newList.shift(index, index + 1);

    setList(newList);
  }

  function handleInputChange(e: any) {
    const currentValue = e.target.value;

    setInputValue(currentValue);
  }

  return (
    <Card>
      <Card>
        <Row gutter={24}>
          <Col span={16}>
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter') {
                  handleAddTodoItem();
                }
              }}
            />
          </Col>
          <Col span={8}>
            <Button onClick={handleAddTodoItem}>添加</Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <List
          dataSource={list}
          bordered
          renderItem={(item: any, index: number) => (
            <List.Item style={{ position: 'relative' }}>
              <span>{item}</span>
              <Icon
                type="close"
                onClick={() => { handleRemoveTodoItem(index); }}
                style={{ position: 'absolute', right: 10, top: 16 }}
              />
            </List.Item>
          )}
        />
      </Card>
    </Card>
  );
}

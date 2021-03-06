import React, { Component } from 'react';
import {
    Input,
    Button,
    Grid, Icon,
} from '@icedesign/base';

import {  FormBinder, FormError } from '@icedesign/form-binder';
import Select, {Option} from "@icedesign/base/lib/select";

const { Row, Col } = Grid;

const styles = {
    formItem: {
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
    },
    formItemLabel: {
        width: '70px',
        marginRight: '10px',
        display: 'inline-block',
        textAlign: 'right',
    },
    formItemError: {
        marginLeft: '10px',
    },
    preview: {
        border: '1px solid #eee',
        marginTop: 20,
        padding: 10
    }
};

export default class RequestCheckPoint extends Component{

    render() {
        return (
            <div>
                {this.props.requestCheckPoints.map((requestCheckPoint, index) => {
                    return (
                        <Row key={index} >
                            <Col>
                                <FormBinder required message="属性必填" name={`requestCheckPoints[${index}].property`} >
                                    <Input placeholder="属性" style={{width: '100%'}} />
                                </FormBinder>
                                <FormError name={`requestCheckPoints[${index}].property`} />
                            </Col>
                            &nbsp;
                            <Col>
                                <FormBinder required message='比较选项必选' name={`requestCheckPoints[${index}].operation`}>
                                    <Select style={{width: '100%'}}
                                        placeholder="选择比较选项"
                                    >
                                        <Option value="EQUALS">等于</Option>
                                        <Option value="NOTEQUALS">不等于</Option>
                                    </Select>
                                </FormBinder>
                            </Col>
                            &nbsp;
                            <Col>
                                <FormBinder name={`requestCheckPoints[${index}].value`} required message="请输入预测值" >
                                    <Input placeholder="值" style={{width: '100%'}}/>
                                </FormBinder>
                                <FormError name={`requestCheckPoints[${index}].value`} />
                            </Col>
                            <Col>
                                <Button type="secondary" onClick={this.props.removeItem.bind(this, index)}>
                                    <Icon type="ashbin" size='xxxl'/>
                                </Button>
                            </Col>
                        </Row>
                    );
                })}
                <div style={styles.buttons}>
                    <Button type="secondary" onClick={this.props.addItem}>
                        <Icon type="add" size='xxl'/>
                    </Button>
                </div>
            </div>
        );
    }
}

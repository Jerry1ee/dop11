import React, { Component } from 'react';
import {
    FormBinderWrapper,
    FormBinder,
    FormError,
} from '@icedesign/form-binder';
import {
    Input,
    Button,
    Checkbox,
    Grid, Icon,Balloon
} from '@icedesign/base';
import {TabPane} from "@icedesign/base/lib/tab";
import Tab from "@icedesign/base/lib/tab";
import RequestHeader from "./RequestHeader";
import RequestCheckPoint from "./RequestCheckPoint";
import {Option} from "@icedesign/base/lib/select";
import Select from "@icedesign/base/lib/select";
import ResultParam from "./ResultParam";
import RequestParam from "./RequestParam";

const { Row, Col } = Grid;
const demo = JSON.stringify({
    "a": "1",
    "b": "2"
});

const paramTab = (
    <div>
        添加参数&nbsp;
        <Balloon trigger={
            <Icon type="help" size='xs'/>
        } triggerType="hover" align='r'>
            选择当前请求的响应数据作为后续请求的参数, 对于形如
            <code>
                {demo}
            </code>
            的JSON响应体数据，添加参数名:paramA ， 值:a ，在后续请求中用$&#123;paramA&#125;引用参数即可.
        </Balloon>
    </div>
);


const checkPointTab = (
    <div>
        检查点&nbsp;
        <Balloon trigger={
            <Icon type="help" size='xs'/>
        } triggerType="hover" align='r'>
            自动校验响应体的JSON数据, 对于形如
            <code>
                {demo}
            </code>
            的JSON响应体数据，可设置属性a等于1，作为测试用例是否执行成功的依据。
        </Balloon>
    </div>
);


export default class RequestScriptForm extends Component{

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.currentScript
        };
    }

    validateFormAndPost = () => {
        let noError = true;
        this.refs.form.validateAll((errors, values) => {
            if (errors != null) {
                noError = false;
            }
        });
        if (noError) {
            this.doSubmit(this.state.value);
        }
        // this.props.cancel();
    };

    doSubmit = (content) => {
        // this.props.submitRequest(content);
    };

    addItem = () => {
        this.state.value.requestHeaders.push({
            name: '',
            value: ''
        });
        this.setState({ value: this.state.value });
    };

    removeItem = (index) => {
        this.state.value.requestHeaders.splice(index, 1);
        this.setState({
            value: this.state.value
        });
    };

    addCheckPoint = () => {
        this.state.value.requestCheckPoints.push({
            property: '',
            operation: '',
            value: ''
        });
        this.setState({ value: this.state.value });
    };

    removeCheckPoint = (index) => {
        this.state.value.requestCheckPoints.splice(index, 1);
        this.setState({
            value: this.state.value
        });
    };

    addResultParam = () => {
        this.state.value.resultParams.push({
            name: '',
            rawValue: '',
            paramType: 'STRING'
        });
        this.setState({ value: this.state.value });
    };

    removeResultParam = (index) => {
        this.state.value.resultParams.splice(index, 1);
        this.setState({
            value: this.state.value
        });
    };

    addRequestParam = () => {
        this.state.value.requestParams.push({
            name: '',
            value: '',
            paramClass: 'GET_PARAM'
        });
        this.setState({ value: this.state.value });
    };

    removeRequestParam = (index) => {
        this.state.value.requestParams.splice(index, 1);
        this.setState({
            value: this.state.value
        });
    };

    renderTab = (key) => {
        if (key === 'header') {
            return <RequestHeader
                requestHeaders={this.state.value.requestHeaders}
                addItem={this.addItem.bind(this)}
                removeItem={this.removeItem.bind(this)}/>;
        }

        if (key === 'param') {
            return <RequestParam
                requestParams={this.state.value.requestParams}
                addItem={this.addRequestParam.bind(this)}
                removeItem={this.removeRequestParam.bind(this)}/>;
        }

        if (key === 'body') {
            return <Row>
                <Col>
                    <FormBinder name="requestBody" >
                        <Input multiple style={{width: '100%'}}/>
                    </FormBinder>
                </Col>
            </Row>;
        }
        if (key === 'checkPoint') {
            return <RequestCheckPoint
                requestCheckPoints={this.state.value.requestCheckPoints}
                addItem={this.addCheckPoint.bind(this)}
                removeItem={this.removeCheckPoint.bind(this)}/>;
        }
        if (key === 'requestParam') {
            return <ResultParam
                resultParams={this.state.value.resultParams}
                addItem={this.addResultParam.bind(this)}
                removeItem={this.removeResultParam.bind(this)}
            />
        }
    };

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            value: nextProps.currentScript
        })
    }


    render() {
        const tabs = [
            { tab: "请求头", key: "header", content: "这里是首页内容" },
            { tab: "请求参数", key: "param", content: "这里是首页内容" },
            { tab: "请求体", key: "body", content: "这里是文档内容" },
            { tab: checkPointTab, key: "checkPoint", content: "这里是 API 内容" },
            { tab: paramTab, key: "requestParam", content: "这里是 API 内容" }
        ];

        return (
            <div>
                <FormBinderWrapper
                    value={this.state.value}
                    ref="request">
                    <Row>
                        <Col span="4">
                            <FormBinder name="httpMethod" >
                                <Select placeholder="选择请求方法" style={{width: '100%'}}
                                >
                                    <Option value="GET">GET</Option>
                                    <Option value="POST">POST</Option>
                                    <Option value="PUT">PUT</Option>
                                    <Option value="DELETE">DELETE</Option>
                                </Select>
                            </FormBinder>
                        </Col>
                        <Col span="20">
                            <FormBinder name="rawUrl" >
                                <Input placeholder="请输入请求url" style={{width: '100%'}}/>
                            </FormBinder>
                        </Col>
                    </Row>
                </FormBinderWrapper>

                <Tab onChange={this.handleChange}>
                    {tabs.map(item => (
                        <TabPane key={item.key} tab={item.tab} onClick={this.handleClick}>
                            <FormBinderWrapper
                                value={this.state.value}
                                ref="form"
                            >
                                {this.renderTab(item.key)}
                            </FormBinderWrapper>
                        </TabPane>
                    ))}
                </Tab>
            </div>
        );
    }



}

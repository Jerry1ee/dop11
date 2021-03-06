/* eslint-disable react/no-unused-state, no-plusplus */
import React, { Component } from 'react';
import {Table, Switch, Icon, Button, Grid, Pagination, Dialog, Select, Input, Feedback} from '@icedesign/base';
import IceContainer from '@icedesign/container';
import API from "../../../API";
import Axios from "axios";
import {Link} from "react-router-dom";
import {FormBinder, FormBinderWrapper} from "@icedesign/form-binder";
import {withRouter} from "react-router-dom";
import Balloon from "@alifd/next/lib/balloon";

const { Row, Col } = Grid;
const Toast = Feedback.toast;

class GroupTable extends Component {
    static displayName = 'CustomTable';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            formValue: {},
            current: 1,
            createdCaseNeedRefresh: false,
            createManualDialogVisiable: false,
            isSubmit: false,
            total: 1,
            currentData: [{}],
            searchValue: {
                owner: '',
                type: 'interface',
                group: '',
                result: '',
                cuser: ''
            },
        };

        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.refreshList(1);
    }

    formChange = (value) => {
        console.log('changed value', value);
        this.setState({
            formValue: value,
        });
    };

    onChange = (...args) => {

    };

    handlePaginationChange = (current) => {
        this.refreshList(current);
    };

    refreshList(current) {
        if (!current) {
            current = 1;
        }
        let url = API.test + '/group/page';
        let _this = this;
        Axios.get(url, {
            params: {
                pageSize: 10,
                pageNo: current
            }
        }).then(function (response) {
            _this.setState({
                current: current,
                total: response.data.totalCount,
                currentData: response.data.pageList
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

    renderOper = (value, index, record) => {
        let MoveTarget = <Icon
            type="search"
            size="small"
            style={{...styles.icon, ...styles.deleteIcon}}
            onClick={() => {
                this.props.history.push('/test/groupLogs/' + record.id);
            }}
        />;

        let edit = <Icon
            type="edit"
            size="small"
            style={{...styles.icon, ...styles.editIcon}}
            onClick={() => {
                this.props.history.push('/test/editGroups/' + record.id);
            }}
        />;
        return (
            <div style={styles.oper}>
                <Balloon.Tooltip trigger={edit} triggerType="hover" align='l'>
                    编辑
                </Balloon.Tooltip>
                <Balloon.Tooltip trigger={MoveTarget} triggerType="hover" align='r'>
                    查看执行记录
                </Balloon.Tooltip>
            </div>
        );
    };


    renderSwitch = (value,index,record) => {
        let groupId = record.id;
        return <Switch onChange={(checked) => {
            if (checked) {
                Toast.success("测试分组开始执行，执行结果请在分组执行历史记录中查看!");
                this.execute(groupId);
            }
        }
        }/>;
    };

    execute = (id) => {
        // only interface script is executable
        let url = API.test + '/group/execute/' + id;
        Axios.get(url).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error);
        });
    };

    renderWay = (value, index, record) => {
        let way = record.executeWay;
        if (way === 'SERIAL') return '串行';
        else return '并行';
    };

    onOpen = () =>{
        this.setState({
            createManualDialogVisiable: true
        })
    };

    onClose = () =>{
        this.setState({
            createManualDialogVisiable: false,
            isSubmit: false
        })
    };

    onOk = ()=>{
        this.setState({
            isSubmit: true
        })
    };

    render() {
        const {searchValue} = this.state.searchValue;

        return (
            <div>
                <IceContainer title="搜索">
                    <FormBinderWrapper value={this.state.searchValue} onChange={this.formChange}>
                        <Row wrap>
                            <Col xxs="24" l="8" style={styles.formCol}>
                                <span style={styles.label}>用例归属:</span>
                                <FormBinder name="owner">
                                    <Select placeholder="请选择" style={{ width: '200px' }}>
                                        <Select.Option value="mine">我的用例</Select.Option>
                                        <Select.Option value="all">所有用例</Select.Option>
                                    </Select>
                                </FormBinder>
                            </Col>

                            <Col xxs="24" l="8" style={styles.formCol}>
                                <span style={styles.label}>类型:</span>
                                <FormBinder name="type">
                                    <Select placeholder="请选择" style={{ width: '200px' }} defaultValue="interface" onClose={this.refreshList.bind(this, 1)}>
                                        <Select.Option value="manual">手工测试</Select.Option>
                                        <Select.Option value="interface">接口测试</Select.Option>
                                    </Select>
                                </FormBinder>
                            </Col>

                            <Col xxs="24" l="8" style={styles.formCol}>
                                <span style={styles.label}>所属分组:</span>
                                <FormBinder name="group">
                                    <Select placeholder="请选择" style={{ width: '200px' }}>
                                        <Select.Option value="success">分组1</Select.Option>
                                        <Select.Option value="fail">分组2</Select.Option>
                                        <Select.Option value="block">分组3</Select.Option>
                                        <Select.Option value="all">所有</Select.Option>
                                    </Select>
                                </FormBinder>
                            </Col>

                            <Col xxs="24" l="8" style={styles.formCol}>
                                <span style={styles.label}>执行结果:</span>
                                <FormBinder name="result">
                                    <Select placeholder="请选择" style={{ width: '200px' }}>
                                        <Select.Option value="success">成功</Select.Option>
                                        <Select.Option value="fail">失败</Select.Option>
                                        <Select.Option value="block">阻塞</Select.Option>
                                        <Select.Option value="all">所有</Select.Option>
                                    </Select>
                                </FormBinder>
                            </Col>

                            <Col xxs="24" l="8" style={styles.formCol}>
                                <span style={styles.label}>创建者:</span>
                                <FormBinder name="cuser">
                                    <Input />
                                </FormBinder>
                            </Col>
                        </Row>
                    </FormBinderWrapper>
                </IceContainer>

                <IceContainer title="用例列表">
                    <Row wrap style={styles.headRow}>
                        <Col l="12">
                            <Button style={styles.button} onClick={this.onOpen.bind(this)} >
                                <Icon type="add" size="xs" style={{ marginRight: '4px' }} />分组
                            </Button>

                        </Col>
                        <Col l="12" style={styles.center}>
                            <Button type="normal" style={styles.button}>
                                删除
                            </Button>
                        </Col>
                    </Row>

                    <Table
                        dataSource={this.state.currentData}
                        rowSelection={{ onChange: this.onChange }}
                    >
                        <Table.Column title="分组编号" dataIndex="id" width={100} />
                        <Table.Column title="分组名称" dataIndex="groupName" width={100} />
                        <Table.Column title="备注" dataIndex="comment" width={100} />
                        <Table.Column title="执行方式" width={100} cell={this.renderWay}/>
                        <Table.Column title="创建者" dataIndex="createUserName" width={100} />
                        <Table.Column title="用例个数" dataIndex="caseCount" width={100} />
                        <Table.Column title="执行/终止" width={100} cell={this.renderSwitch} />
                        <Table.Column title="操作" width={100} cell={this.renderOper} />
                    </Table>
                    <Pagination
                        style={styles.pagination}
                        current={this.state.current}
                        onChange={this.handlePaginationChange}
                        total={this.state.total}
                    />
                </IceContainer>
            </div>
        );
    }
}

const styles = {
    headRow: {
        marginBottom: '10px',
    },
    icon: {
        color: '#2c72ee',
        cursor: 'pointer',
    },
    deleteIcon: {
        marginLeft: '20px',
    },
    center: {
        textAlign: 'right',
    },
    button: {
        borderRadius: '4px',
        color: '#5485F7'
    },
    pagination: {
        marginTop: '20px',
        textAlign: 'right',
    },
    formRow: {
        marginBottom: '18px',
    },
    formCol: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    label: {
        lineHeight: '28px',
        paddingRight: '10px',
    },
};

export default withRouter(GroupTable)

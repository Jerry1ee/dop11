import React, {Component} from 'react';
import {Table, Button, Loading, Feedback} from '@icedesign/base';
import {Link} from 'react-router-dom';
import API from "../../API";
import Axios from "axios/index";
import './Styles.scss'
import {injectIntl,FormattedMessage} from "react-intl";

const {toast} = Feedback;

class PipelineTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dataSource: [],
            current: 1,
            visible: false
        }
    }

    componentWillMount() {
        this.getPipeline();
        this.setState({
            visible: true
        })
    }

    getPipeline() {
        let url = API.pipeline + '/v1/pipelines/brief';
        let self = this;
        Axios.get(url).then((response) => {
            let dataSource = [];
            let data = response.data.sort();
            self.setState({
                dataSource: data,
                visible: false
            });
        }).catch(()=>{
            toast.show({
                type: "error",
                content: self.props.intl.messages["pipeline.table.operation.requestFailure"],
                duration: 1000
            });
            self.setState({
                visible: false
            });
        })
    }

    removeByIdSQL(id) {
        let url = API.pipeline + '/v1/delete/' + id;
        let self = this;
        Axios.put(url).then((response) => {
            let pipelineInfo = this.state.dataSource;
            if (response.status === 200) {
                pipelineInfo.splice(pipelineInfo.findIndex((value) => {
                    return value.id === id
                }), 1);
                self.setState({
                    dataSource: pipelineInfo,
                    visible: false
                });
                toast.show({
                    type: "success",
                    content: self.props.intl.messages["pipeline.table.operation.deleteSuccess"],
                    duration: 1000
                });
            }
        })
    }


    deletePipeline(pipelineInfo) {
        let url = API.pipeline + '/v1/jenkins/' + pipelineInfo.id;
        let self = this;
        self.setState({
            visible: true
        });
        Axios({
            method: 'delete',
            url: url,
        }).then((response) => {
            if (response.status === 200) {
                self.removeByIdSQL(pipelineInfo.id);
            } else {
                toast.show({
                    type: "error",
                    content: self.props.intl.messages["pipeline.table.operation.deleteFailure"],
                    duration: 1000
                });
            }
        });
    }

    /**
     *  表格 序号栏配置
     * */
    renderIndex(value, index) {
        return index + 1;
    };


    /**
     *  表格 操作栏配置
     * */
    renderOperation(value, index, record) {
        let router = "/pipeline/project/" + record.id;
        let edit = "/pipeline/edit/" + record.id;
        return (
            <div>
                <Link to={router}>
                    <Button type="primary" size="small">
                        <FormattedMessage
                            id="pipeline.table.operation.check"
                            defaultMessage="查看"
                        />
                    </Button>
                </Link>
                <Link to={edit}>
                    <Button
                        type="normal"
                        size="small"
                        className="button"
                        disabled
                    >
                        <FormattedMessage
                            id="pipeline.table.operation.edit"
                            defaultMessage="编辑"
                        />
                    </Button>
                </Link>

                <Button
                    type="primary"
                    shape="warning"
                    size="small"
                    className="button"
                    onClick={this.deletePipeline.bind(this, record)}
                >
                    <FormattedMessage
                        id="pipeline.table.operation.delete"
                        defaultMessage="删除"
                    />
                </Button>
            </div>
        );
    };

    render() {
        const columns = [{
            title: this.props.intl.messages["pipeline.table.index"],
            width: 5,
            dataIndex: 'index',
            cell: this.renderIndex
        }, {
            title: this.props.intl.messages["pipeline.table.name"],
            width: 10,
            dataIndex: 'name',
        }, {
            title: this.props.intl.messages["pipeline.table.createTime"],
            width: 10,
            dataIndex: 'ctime'
        }, {
            title: this.props.intl.messages["pipeline.table.creator"],
            width: 8,
            dataIndex: 'cuser'
        }, {
            title: this.props.intl.messages["pipeline.table.operation"],
            width: 10,
            dataIndex: 'operation',
            cell: this.renderOperation.bind(this)
        }];
        return (
            <div>
                <Loading shape="fusion-reactor" visible={this.state.visible} className="next-loading my-loading">
                    <Table
                        dataSource={this.state.dataSource}
                        language={window.sessionStorage.getItem('language').toLocaleLowerCase()}
                    >
                        {columns.map((item, index) => {
                            return (
                                <Table.Column
                                    key={index}
                                    title={item.title}
                                    width={item.width || 'auto'}
                                    dataIndex={item.dataIndex}
                                    cell={item.cell || (value => value)}
                                />
                            );
                        })}
                    </Table>
                </Loading>
            </div>
        )
    }
}

export default injectIntl(PipelineTable)

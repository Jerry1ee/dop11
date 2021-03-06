import {
    Dialog,
    Button,
    Grid,
    Input,
    Form,
    Field,
    Radio, Feedback
}
    from "@icedesign/base";
import API from "../../../../API";
import Axios from "axios";
import React, {Component} from 'react';
import { FormBinderWrapper, FormBinder, FormError } from '@icedesign/form-binder';
import {TestSteps} from "../TestStep";
import IceContainer from '@icedesign/container';

const styles = {
    formItem: {
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
    },
    formItemLabel: {
        width: '70px',
        mariginRight: '10px',
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
    },
    formCommonWidth: {
        width: "550px"
    }
};

const Toast = Feedback.toast;
/**
 *    弹窗中的表单
 *
 * */
export default class CreateManualCaseFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                caseName: '',
                caseDesc: '',
                preCondition: '',
                applicationId: '',
                comment: '',
                status: 'NEW',
                testSteps: [{}]
            },
            isDialogSubmit: this.props.isSubmit
        };
        this.field = new Field(this);
    }


    addItem = () => {
        this.state.value.testSteps.push({});
        this.setState({ value: this.state.value });
    };


    changeItem = () => {
        let testSteps = this.state.value.testSteps;
        testSteps[0].aaa = '有趣';
        this.setState({
            value: {
                ...this.state.value,
                testSteps: testSteps
            }
        });
    };

    removeItem = (index) => {
        this.state.value.testSteps.splice(index, 1);
        this.setState({
            value: this.state.value
        });
    };

    validateFormAndPost = () => {
        let noError = true;
        this.refs.form.validateAll((errors, values) => {
            if (errors != null) {
                noError = false;
            }
        });
        if (noError) {
            this.doPost(this.state.value);
        }
    };

    doPost = (content) => {
        let url = API.test + '/manualCases';
        let _this = this;
        Axios.post(url, content)
            .then(function (response) {
                if (response.data) {
                    Toast.success("添加手工测试用例成功！");
                }
                _this.props.close();
                _this.props.refresh();
                // let route = '/testCases';
                // _this.props.history.push(route);
            }).catch(function (error) {
            console.log(error);
            Toast.error(error);
        });
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.isSubmit) {
            this.validateFormAndPost(nextProps);
        }
    }

    render() {
        return (
            <IceContainer title="创建手工测试用例">
                <FormBinderWrapper
                    value={this.state.value}
                    ref="form"
                >
                    <div style={styles.content}>

                        <div style={styles.formItem}>
                            <span style={styles.formItemLabel}>用例名称：</span>
                            <FormBinder name="caseName" required message="请输入正确的用例名称" >
                                <Input placeholder="case name" style={styles.formCommonWidth}/>
                            </FormBinder>
                            <FormError style={styles.formItemError} name="caseName" />
                        </div>

                        <div style={styles.formItem}>
                            <span style={styles.formItemLabel}>用例描述：</span>
                            <FormBinder name="caseDesc" required message="请输入用例描述" >
                                <Input placeholder="case description" style={styles.formCommonWidth}/>
                            </FormBinder>
                            <FormError style={styles.formItemError} name="caseDesc" />
                        </div>

                        <div style={styles.formItem}>
                            <span style={styles.formItemLabel}>前置条件：</span>
                            <FormBinder name="preCondition" required message="请输入前置条件" >
                                <Input multiple placeholder="pre condition" style={styles.formCommonWidth}/>
                            </FormBinder>
                            <FormError style={styles.formItemError} name="caseDesc" />
                        </div>

                        <div style={styles.formItem}>
                            <span style={styles.formItemLabel}>应用ID：</span>
                            <FormBinder name="applicationId" required format="number" message="请绑定用例对应的应用id" >
                                <Input placeholder="application id" style={styles.formCommonWidth}/>
                            </FormBinder>
                            <FormError style={styles.formItemError} name="application id" />
                        </div>

                        <TestSteps
                            testSteps={this.state.value.testSteps}
                            addItem={this.addItem}
                            removeItem={this.removeItem}
                            validateAllFormField={this.validateAllFormField}
                        />

                    </div>
                </FormBinderWrapper>
            </IceContainer>
        )
    }
}

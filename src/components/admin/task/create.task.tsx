import { useEffect, useState } from 'react';
import {
    App, Col, Divider, Form, Input,
    Modal, Row, Select
} from 'antd';
import type { FormProps } from 'antd';
import type { UploadFile } from 'antd';
import { createTaskAPI, getUserAPI } from '@/services/api';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

interface IUserSelect {
    label: string;
    value: string;
    key?: string;
}

type FieldType = {
    title: string;
    description: string,
    assignedTo: string;
};

const CreateTask = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const { message, notification } = App.useApp();
    const [userList, setUserList] = useState<IUserSelect[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        async function fetchUserList() {
            setLoadingUsers(true);
            try {
                const res = await getUserAPI('current=1&pageSize=100&role=EMPLOYEE');
                if (res?.data?.result) {
                    const users: IUserSelect[] = res.data.result.map(user => ({
                        label: user.name,
                        value: user._id,
                    }));
                    setUserList(users);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách user:', error);
            }
            setLoadingUsers(false);
        }
        fetchUserList();
    }, []);

    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)
        const { assignedTo, description, title } = values;
        const res = await createTaskAPI(title, description, assignedTo);
        if (res && res.data) {
            message.success('Tạo công việc thành công!');
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
    };

    return (
        <>
            <Modal
                title="Thêm mới công việc"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalCreate(false);
                }}
                destroyOnClose={true}
                okButtonProps={{ loading: isSubmit }}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={"50vw"}
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={form}
                    name="form-create-task"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tiêu đề"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tiêu đề công việc!'
                                    }
                                ]}
                            >
                                <Input placeholder='Nhập tiêu đề công việc' />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Nội dung công việc"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập nhập nội dung công việc!'
                                    }
                                ]}
                            >
                                <Input.TextArea placeholder="Nhập nội dung công việc..." rows={4} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Chọn nhân viên"
                                name="assignedTo"
                                rules={[{ required: true, message: 'Vui lòng chọn user!' }]}
                            >
                                <Select
                                    loading={loadingUsers}
                                    options={userList}
                                    placeholder="Tên nhân viên"
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal >
        </>
    )
}

export default CreateTask;
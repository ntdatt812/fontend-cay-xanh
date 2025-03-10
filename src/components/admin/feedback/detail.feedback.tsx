import { updateStatusFeedbackAPI } from "@/services/api";
import { App, Button, Descriptions, Drawer, Form, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const { Option } = Select;
interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IFeedback | null | any;
    setDataInit: (v: IFeedback | null) => void;
    reloadTable: () => void;
}

const FeedbackDetail = ({ dataInit, onClose, open, reloadTable, setDataInit }: IProps) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm();
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (dataInit) {
            form.setFieldValue("status", dataInit.status)
        }
        return () => form.resetFields();
    }, [dataInit])



    const handleChangeStatus = async () => {
        setIsSubmit(true);
        const status = form.getFieldValue('status');
        const res = await updateStatusFeedbackAPI(dataInit?._id, status)
        if (res.data) {
            message.success("Cập nhật trạng thái phản ánh thành công!");
            setDataInit(null);
            onClose(false);
            reloadTable();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
        setIsSubmit(false);
    }

    return (
        <>
            <Drawer
                title="Chi tiết feedback"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"60vw"}
                maskClosable={false}
                destroyOnClose
                extra={

                    <Button loading={isSubmit} type="primary"
                        onClick={handleChangeStatus}
                    >
                        Cập nhật
                    </Button>

                }
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Người phản ánh">{dataInit?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataInit?.emailFeedback}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Form
                            form={form}
                        >
                            <Form.Item name={"status"}>
                                <Select
                                    style={{ width: "100%" }}
                                    defaultValue={dataInit?.status}
                                >
                                    <Option value="PENDING">Đã gửi</Option>
                                    <Option value="IN_PROGRESS">Đang được xử lý<nav></nav></Option>
                                    <Option value="COMPLETED">Đã xử lý</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tiêu đề">{dataInit?.title}</Descriptions.Item>
                    <Descriptions.Item label="Nội dung">{dataInit?.content}</Descriptions.Item>
                    <Descriptions.Item label="Cây xanh">
                        {`Tên cây xanh `}<strong>{dataInit?.treeId.tencayxanh}</strong>{` tại khu vực `}
                        <strong>{dataInit?.treeId.khuvuc}</strong>{` có toạ độ (`}
                        <strong>{dataInit?.treeId.lat}</strong>{`, `}
                        <strong>{dataInit?.treeId.lng}</strong>{`)`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày nhận">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>

                </Descriptions>
            </Drawer>
        </>
    )
}

export default FeedbackDetail
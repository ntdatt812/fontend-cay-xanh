import { updateStatusFeedbackAPI } from "@/services/api";
import { App, Button, Descriptions, Divider, Drawer, Form, GetProp, Image, Input, Select, Upload, UploadProps } from "antd";
import { UploadFile } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const { Option } = Select;
import { v4 as uuidv4 } from 'uuid';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
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
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataInit) {
            form.setFieldValue("status", dataInit.status)
        }
        return () => form.resetFields();
    }, [dataInit])


    useEffect(() => {
        if (dataInit) {
            let imgFeedback: any = {};
            if (dataInit.hinhanh) {
                imgFeedback = {
                    uid: uuidv4(),
                    name: dataInit.hinhanh,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/feedback/${dataInit.hinhanh}`,
                }
            }
            setFileList([imgFeedback])
        }
    }, [dataInit])

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handleChangeStatus = async () => {
        setIsSubmit(true);
        const status = form.getFieldValue('status');
        const report = form.getFieldValue('report');
        const res = await updateStatusFeedbackAPI(dataInit?._id, status, report)
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

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    return (
        <>
            <Drawer
                title="Chi tiết feedback"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"70vw"}
                maskClosable={true}
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
                    <Descriptions.Item label="Tiêu đề">{dataInit?.title}</Descriptions.Item>
                    <Descriptions.Item span={2} label="Nội dung">{dataInit?.content}</Descriptions.Item>
                    <Descriptions.Item span={2} label="Cây xanh">
                        {`Tên cây xanh `}<strong>{dataInit?.treeId.tencayxanh}</strong>{` tại khu vực `}
                        <strong>{dataInit?.treeId.khuvuc}</strong>{` có toạ độ (`}
                        <strong>{dataInit?.treeId.lat}</strong>{`, `}
                        <strong>{dataInit?.treeId.lng}</strong>{`)`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày nhận">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item span={2} label="Trạng thái và phản hồi">
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
                            <Form.Item
                                name={"report"}
                                label="Nhập nội dung trả lời phản ánh"
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation="left" > Ảnh cây xanh </Divider>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >

                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}

export default FeedbackDetail
import { useEffect, useState } from 'react';
import {
    App, Col, Divider, Form, Image, Input,
    Modal, Row, Upload
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/services/helper';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { createFeedbackAPI, uploadFileAPI } from '@/services/api';
const { TextArea } = Input;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    tree: ITree | null;
}

interface IFeedbackField {
    _id: string;
    fullName: string;
    phoneNumber: string;
    emailFeedback: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED"; // Trạng thái xử lý feedback
    title: string;
    content: string;
    treeId: string;
    userId: string;
    hinhanh: string;
    history: IHistory[];
    createdBy: IUser;
    createdAt: string;
    updatedAt: string;
    updatedBy: IUser;
}



const ModalPostFeedback = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, tree } = props;
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    const [isSubmit, setIsSubmit] = useState(false);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');


    const onFinish: FormProps<IFeedbackField>['onFinish'] = async (values) => {
        setIsSubmit(true)
        const { fullName, phoneNumber, emailFeedback, title, content } = values;
        const treeId: string = (tree?._id ?? "").trim()
        console.log("check tree id:", treeId)
        const hinhanh = fileListThumbnail?.[0]?.name ?? "";

        const res = await createFeedbackAPI(
            fullName, phoneNumber,
            emailFeedback, title, content, treeId, hinhanh,

        );
        if (res && res.data) {
            // message.success('Đã gửi phản ánh');
            notification.success({
                message: 'Đã gửi phản ánh thành công!',
                description: "Cảm ơn bạn đã đóng góp xây dựng môi trường xanh cho Trường Đại học Hồng Đức ^^"
            })
            form.resetFields();
            setFileListThumbnail([]);
            setOpenModalCreate(false);
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
    };

    const getBase64 = (file: FileType): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };


    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = async (file: UploadFile) => {
        setFileListThumbnail([])
    };

    const handleChange = (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
            setLoadingThumbnail(true);
            return;
        }

        if (info.file.status === 'done') {
            setLoadingThumbnail(false);
        }
    };

    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "feedback");

        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileName,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/feedback/${res.data.fileName}`
            }
            setFileListThumbnail([{ ...uploadedFile }])
            if (onSuccess)
                onSuccess('ok')
        } else {
            message.error(res.message)
        }
    };
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <>
            <Modal
                title="Gửi phản ánh"
                open={openModalCreate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalCreate(false);
                    setFileListThumbnail([]);
                }}
                destroyOnClose={true}
                okButtonProps={{ loading: isSubmit }}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={window.innerWidth > 768 ? "50vw" : "90vw"}
                maskClosable={false}
                bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
            >
                <Divider />

                <Form
                    form={form}
                    name="form-create-tree"
                    key={tree?._id}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={12} xs={24} sm={24} md={12}>
                            <Form.Item<IFeedbackField>
                                labelCol={{ span: 24 }}
                                label="Tên của bạn"
                                name="fullName"
                                rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12} xs={24} sm={24} md={12}>
                            <Form.Item<IFeedbackField>
                                labelCol={{ span: 24 }}
                                label="Tiêu đề"
                                name="title"
                                initialValue={tree ? `Phản ánh ${tree.tencayxanh}, khu vực ${tree.khuvuc}, tại tọa độ (${tree.lat}, ${tree.lng})` : ""}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12} xs={24} sm={24} md={12}>
                            <Form.Item<IFeedbackField>
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="emailFeedback"
                                rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12} xs={24} sm={24} md={12}>
                            <Form.Item<IFeedbackField>
                                labelCol={{ span: 24 }}
                                label="Số điện thoại"
                                name="phoneNumber"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Col>

                        <Col span={24} xs={24} sm={24} md={12}>
                            <Form.Item<IFeedbackField>
                                labelCol={{ span: 24 }}
                                label="Nội dung"
                                name="content"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung phản ánh!' }]}
                            >
                                <TextArea size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12} xs={24} sm={24} md={12}>
                            <Form.Item<IFeedbackField>
                                labelCol={{ span: 24 }}
                                label="Hình phản ánh"
                                name="hinhanh"
                                rules={[{ required: true, message: 'Vui lòng nhập upload hình ảnh!' }]}

                                //convert value from Upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={(options) => handleUploadFile(options)}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info)}
                                    onPreview={handlePreview}
                                    onRemove={(file) => handleRemove(file)}
                                    fileList={fileListThumbnail}
                                >
                                    <div>
                                        {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Tải ảnh</div>
                                    </div>
                                </Upload>
                            </Form.Item>

                        </Col>
                    </Row>
                </Form>

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
            </Modal>
        </>
    )
}

export default ModalPostFeedback;
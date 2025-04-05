import { useEffect, useState } from 'react';
import {
    App, Col, Divider, Form, Image, Input, Modal, Row, Select, Upload
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/services/helper';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { UpdateEmployTaskAPI, uploadFileAPI } from '@/services/api';
import { v4 as uuidv4 } from 'uuid';
import { Option } from 'antd/es/mentions';

const { TextArea } = Input;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    dataUpdate: ITaskTable | null;
    setDataUpdate: (v: ITaskTable | null) => void;
    setOpenModalUpdate: (v: boolean) => void;
    openModalUpdate: boolean;
    refreshTable: () => void;
}

type FieldType = {
    _id: string;
    title: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    imageUrl: string;
    report: string;
    description: string;
    assignedTo: IUpdateAt;
};

const UpdateEmployTask = (props: IProps) => {
    const { dataUpdate, openModalUpdate, setDataUpdate, setOpenModalUpdate, refreshTable } = props;
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    // const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        if (dataUpdate) {

            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.imageUrl,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/task/${dataUpdate.imageUrl}`,
                }
            ]
            form.setFieldsValue({
                _id: dataUpdate._id,
                title: dataUpdate.title,
                description: dataUpdate.description,
                assignedTo: dataUpdate.assignedTo.name,
                report: dataUpdate.report,
            })
            setFileListThumbnail(arrThumbnail as any);
        }
    }, [dataUpdate])


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)
        console.log("check values", values)
        const { _id, report, status } = values;

        const hinhanh = fileListThumbnail?.[0]?.name ?? "";

        const res = await UpdateEmployTaskAPI(_id, status, report, hinhanh);
        if (res && res.data) {
            message.success('Cập nhật cây thành công');
            form.resetFields();
            setFileListThumbnail([]);
            setOpenModalUpdate(false);
            refreshTable();
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
        const res = await uploadFileAPI(file, "task");

        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileName,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/task/${res.data.fileName}`
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
                title="Báo cáo công việc"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalUpdate(false);
                }}
                destroyOnClose={true}
                okButtonProps={{ loading: isSubmit }}
                okText={"Gửi báo cáo"}
                cancelText={"Hủy bỏ"}
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
                                label="Id"
                                name="_id"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tiêu đề"
                                name="title"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Nội dung công việc"
                                name="description"
                            >
                                <Input.TextArea disabled placeholder="Nhập nội dung công việc..." rows={4} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Người thực hiện"
                                name="assignedTo"

                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Báo cáo công việc"
                                name="report"
                            >
                                <Input.TextArea placeholder="Nhập nội dung báo cáo..." rows={4} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Trạng thái công việc"
                                name="status"
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    defaultValue={dataUpdate?.status}
                                >
                                    <Option value="PENDING">Đã gửi</Option>
                                    <Option value="IN_PROGRESS">Đang được xử lý<nav></nav></Option>
                                    <Option value="COMPLETED">Đã xử lý</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Hình ảnh"
                                name="imageUrl"
                                rules={[{ required: true, message: 'Vui lòng nhập upload hình ảnh cây!' }]}

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
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>

                        </Col>
                    </Row>
                </Form>
            </Modal >
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
        </>
    )
}

export default UpdateEmployTask;
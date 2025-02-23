import { useEffect, useState } from 'react';
import {
    App, Col, Divider, Form, Image, Input,
    InputNumber, Modal, Row, Select, Upload
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/services/helper';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { updateTreeAPI, uploadFileAPI } from '@/services/api';
import { v4 as uuidv4 } from 'uuid';

const { TextArea } = Input;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    dataUpdate: ITreeTable | null;
    setDataUpdate: (v: ITreeTable | null) => void;
    setOpenModalUpdate: (v: boolean) => void;
    openModalUpdate: boolean;
    refreshTable: () => void;
}

type FieldType = {
    _id: string,
    tencayxanh: string;
    khuvuc: string,
    lat: string;
    lng: string;
    chieucao: number;
    namtrong: number;
    mota: string;
    hinhanh: string;
    sohieu: string,
    hientrang: string,
};

const UpdateTree = (props: IProps) => {
    const { dataUpdate, openModalUpdate, setDataUpdate, setOpenModalUpdate, refreshTable } = props;
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    const [isSubmit, setIsSubmit] = useState(false);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    // const [listKhuVuc, setListKhuVuc] = useState<{
    //     label: string;
    //     value: string;
    // }[]>([]);

    const [listKhuVuc, setListKhuVuc] = useState([
        { label: 'Khu vực 1', value: 'KV1' },
        { label: 'Khu vực 2', value: 'KV2' },
        { label: 'Khu vực 3', value: 'KV3' },
        { label: 'Khu vực 4', value: 'KV4' },
        { label: 'Khu vực 5', value: 'KV5' },
        { label: 'Khu vực 6', value: 'KV6' },
        { label: 'Khu vực 7', value: 'KV7' },
        { label: 'Khu vực 8', value: 'KV8' },
        { label: 'Khu vực 9', value: 'KV9' },
        { label: 'Khu vực 10', value: 'KV10' },
        { label: 'Khu vực 11', value: 'KV11' },
        { label: 'Khu vực 12', value: 'KV12' },
        { label: 'Khu vực 13', value: 'KV13' },
        { label: 'Khu vực 14', value: 'KV14' },
    ]);
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    // const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    // useEffect(() => {
    //     const fetchCategory = async () => {
    //         const res = await getCategoryAPI();
    //         if (res && res.data) {
    //             const d = res.data.map(item => {
    //                 return { label: item, value: item }
    //             })
    //             setListKhuVuc(d);
    //         }
    //     }
    //     fetchCategory();
    // }, [])

    useEffect(() => {
        if (dataUpdate) {
            const arrThumbnail = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.hinhanh,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/tree/${dataUpdate.hinhanh}`,
                }
            ]
            form.setFieldsValue({
                _id: dataUpdate._id,
                tencayxanh: dataUpdate.tencayxanh,
                khuvuc: dataUpdate.khuvuc,
                lat: dataUpdate.lat,
                lng: dataUpdate.lng,
                chieucao: dataUpdate.chieucao,
                namtrong: dataUpdate.namtrong,
                mota: dataUpdate.mota,
                hinhanh: arrThumbnail,
                sohieu: dataUpdate.sohieu,
                hientrang: dataUpdate.hientrang,
            })
            setFileListThumbnail(arrThumbnail as any);
        }
    }, [dataUpdate])


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)
        const { _id, tencayxanh, chieucao, hientrang,
            khuvuc, lat, lng, mota, namtrong, sohieu } = values;

        const hinhanh = fileListThumbnail?.[0]?.name ?? "";

        const res = await updateTreeAPI(_id,
            tencayxanh, chieucao, hientrang, hinhanh,
            khuvuc, lat, lng, mota, namtrong, sohieu
        );
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
        const res = await uploadFileAPI(file, "tree");

        if (res && res.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: res.data.fileName,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/tree/${res.data.fileName}`
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
                title="Cập nhật cây"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalUpdate(false);
                    setFileListThumbnail([]);
                }}
                destroyOnClose={true}
                okButtonProps={{ loading: isSubmit }}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={"50vw"}
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={form}
                    name="form-create-tree"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="_id"
                            name="_id"
                            hidden
                        >
                            <Input />
                        </Form.Item>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tên cây xanh"
                                name="tencayxanh"
                                rules={[{ required: true, message: 'Vui lòng nhập tên cây!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Năm trồng"
                                name="namtrong"
                                rules={[{ required: true, message: 'Vui lòng nhập năm trồng!' }]}
                            >
                                <InputNumber />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tình trạng cây"
                                name="hientrang"
                                rules={[{ required: true, message: 'Vui lòng nhập tình trạng cây!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Số hiệu"
                                name="sohieu"
                                rules={[{ required: true, message: 'Vui lòng nhập năm trồng!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Mô tả"
                                name="mota"
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả cây!' }]}
                            >
                                <TextArea />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Chiều cao"
                                name="chieucao"
                                rules={[{ required: true, message: 'Vui lòng nhập chiều cao của cây!' }]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter=" cm"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Khu vực"
                                name="khuvuc"
                                rules={[{ required: true, message: 'Vui lòng chọn khu vực!' }]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    options={listKhuVuc}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Vĩ độ (lat)"
                                name="lat"
                                rules={[{ required: true, message: 'Vui lòng nhập số vĩ độ(lat)!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Kinh độ (lng)"
                                name="lng"
                                rules={[{ required: true, message: 'Vui lòng nhập số vĩ độ(lat)!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Hình ảnh cây"
                                name="hinhanh"
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
                        {/* <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                                rules={[{ required: true, message: 'Vui lòng nhập upload slider!' }]}
                                //convert value from Upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    multiple
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={handleUploadFile}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col> */}
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

export default UpdateTree;
import { useState } from 'react';
import {
    App, Button, Col, Divider, Form, Image, Input,
    InputNumber, Modal, Row, Select, Upload
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { MAX_UPLOAD_IMAGE_SIZE } from '@/services/helper';
import { UploadChangeParam } from 'antd/es/upload';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { createTreeAPI, uploadFileAPI } from '@/services/api';
import MapPicker from '../map/LocationNewTree';
const { TextArea } = Input;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
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
    chuvi: number,
    nuoc: string,
    phan: string,
    saubenh: string,
};

const CreateTree = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    const [isSubmit, setIsSubmit] = useState(false);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    // const [listKhuVuc, setListKhuVuc] = useState<{
    //     label: string;
    //     value: string;
    // }[]>([]);

    const [listKhuVuc, setListKhuVuc] = useState([
        { label: 'Khu vực 1 (phía ngoài tường rào cổng chính giáp đường Quốc lộ 1A)', value: 'KV1' },
        { label: 'Khu vực 2 (bãi đỗ xe ô tô trước hội trường và khuôn viên trước nhà điều hành)', value: 'KV2' },
        { label: 'Khu vực 3 (hội trường, nhà điều hành, nhà xe, quảng trường, nhà A6, nhà A7)', value: 'KV3' },
        { label: 'Khu vực 4 (nhà A5, khuôn viên và khu vườn ươm cây)', value: 'KV4' },
        { label: 'Khu vực 5 (khu liên hợp thể thao khoa GDTC)', value: 'KV5' },
        { label: 'Khu vực 6 (bãi cỏ phía trước nhà A1 và sân bóng Lucky)', value: 'KV6' },
        { label: 'Khu vực 7 (nhà A1, nhà xe, nhà A2, căng tin)', value: 'KV7' },
        { label: 'Khu vực 8 (nhà A3, khuôn viên và sân bóng chuyền)', value: 'KV8' },
        { label: 'Khu vực 9 (trung tâm thư viện, xưởng thực hành KTCN và bãi cỏ phía sau thư viện)', value: 'KV9' },
        { label: 'Khu vực 10 (trường THCS, THPT Hồng Đức và trường mầm non thực hành)', value: 'KV10' },
        { label: 'Khu vực 11 (KTX N1, N2, N3, N4 và nhà ăn sinh viên số 01, 02)', value: 'KV11' },
        { label: 'Khu vực 12 (bãi cỏ trục đường nối từ KTX N4 sang KTX N5)', value: 'KV12' },
        { label: 'Khu vực 13 (KTX N5, nhà khách, nhà LHS Lào và nhà ăn sinh viên Lào)', value: 'KV13' },
        { label: 'Khu vực 14 (bồn cây trục đường chính)', value: 'KV14' },
    ]);

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    // const [loadingSlider, setLoadingSlider] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [showMap, setShowMap] = useState(false);
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


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)
        const { tencayxanh, chieucao, hientrang,
            khuvuc, lat, lng, mota, namtrong, sohieu, chuvi, nuoc, phan, saubenh } = values;

        const hinhanh = fileListThumbnail?.[0]?.name ?? "";

        const res = await createTreeAPI(
            tencayxanh, chieucao, hientrang, hinhanh,
            khuvuc, lat, lng, mota, namtrong, sohieu, chuvi, nuoc, phan, saubenh
        );
        if (res && res.data) {
            message.success('Tạo cây mới thành công');
            form.resetFields();
            setFileListThumbnail([]);
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
                title="Thêm mới tree"
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
                        <Col span={10}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tên cây xanh"
                                name="tencayxanh"
                                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Năm trồng"
                                name="namtrong"
                                rules={[{ required: true, message: 'Vui lòng nhập năm trồng!' }]}
                            >
                                <InputNumber
                                    controls={false}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Chiều cao"
                                name="chieucao"
                                rules={[{ required: true, message: 'Vui lòng nhập chiều cao của cây!' }]}
                            >
                                <InputNumber
                                    min={1}
                                    controls={false}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter=" cm"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tình trạng cây"
                                name="hientrang"
                                rules={[{ required: true, message: 'Vui lòng nhập tình trạng cây!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Số hiệu"
                                name="sohieu"
                                rules={[{ required: true, message: 'Vui lòng nhập số hiệu!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Chu vi thân"
                                name="chuvi"
                                rules={[{ required: true, message: 'Vui lòng nhập chu vi của cây!' }]}
                            >
                                <InputNumber
                                    controls={false}
                                    min={1}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter=" cm"
                                />
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
                                label="Nước"
                                name="nuoc"
                                rules={[{ required: true, message: 'Vui lòng chọn nước!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Phân bón"
                                name="phan"
                                rules={[{ required: true, message: 'Vui lòng chọn phân bón!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Sâu bệnh"
                                name="saubenh"
                                rules={[{ required: true, message: 'Vui lòng chọn sâu bệnh!' }]}
                            >
                                <Input />
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
                                label="Lấy toạ độ"
                            >
                                <Button type="primary" onClick={() => setShowMap(true)}>
                                    Chọn toạ độ từ bản đồ
                                </Button>
                            </Form.Item>
                        </Col>
                        <MapPicker
                            visible={showMap}
                            onClose={() => setShowMap(false)}
                            onSelectLocation={(lat, lng) => {
                                form.setFieldsValue({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
                            }}
                        />
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

export default CreateTree;
import { FilterTwoTone, ReloadOutlined, CloseOutlined } from '@ant-design/icons';
import { Checkbox, Col, Divider, Popover, Row, Form } from 'antd';
import '@/styles/filterBar.scss'
interface IProps {
    setFilters: (filters: any) => void;
    openDrawer: boolean;
    setOpenDrawer: (v: boolean) => void;
    children?: React.ReactNode;
}

const FilterPopover = ({ setFilters, openDrawer, setOpenDrawer, children }: IProps) => {
    const [form] = Form.useForm();

    const listKhuVuc = [
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
    ];

    const listDuongKinh = [
        { label: "Cây loại 1: ĐK ≤ 20 cm", value: "0-20" },
        { label: "Cây loại 2: 20 - 50 cm", value: "20-50" },
        { label: "Cây loại 3: ĐK > 50 cm", value: "50+" },
    ];

    // Cập nhật bộ lọc khi chọn checkbox
    const handleChangeFilter = (changedValues: any, values: any) => {
        setFilters({
            khuvuc: values.khuvuc || [],
            duongkinh: values.duongkinh || [],
        });
    };

    // Nội dung của Popover
    const content = (
        <div className="filter-popover">
            <div className="filter-popover__header">
                <strong><FilterTwoTone /> Bộ lọc tìm kiếm</strong>
                <div>
                    <ReloadOutlined
                        className="filter-popover__reload"
                        onClick={() => {
                            form.resetFields()
                            setFilters({ khuvuc: [], duongkinh: [] });
                        }}
                    />
                    <CloseOutlined
                        className="filter-popover__close"
                        onClick={() => setOpenDrawer(false)}
                        style={{ marginLeft: 10, cursor: 'pointer' }}
                    />
                </div>
            </div>
            <Form
                form={form}
                onValuesChange={handleChangeFilter}
                className="filter-popover__form"
            >
                {/* Lọc theo khu vực */}
                <Form.Item name="khuvuc" label="Khu vực cây">
                    <Checkbox.Group className="filter-popover__checkbox-group">
                        <Row>
                            {listKhuVuc.map((item, index) => (
                                <Col span={24} key={index} className="filter-popover__checkbox">
                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Divider />

                {/* Lọc theo đường kính thân */}
                <Form.Item name="duongkinh" label="Đường kính thân">
                    <Checkbox.Group className="filter-popover__checkbox-group">
                        <Row>
                            {listDuongKinh.map((item, index) => (
                                <Col span={24} key={index} className="filter-popover__checkbox">
                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
            </Form>
        </div>
    );

    return (
        <Popover
            content={content}
            trigger="click"
            open={openDrawer}
            onOpenChange={setOpenDrawer}
            placement="bottomLeft"
            style={{ width: "auto" }}
        >
            {children}
        </Popover>
    );
};

export default FilterPopover;

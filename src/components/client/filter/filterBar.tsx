import { Button, Drawer } from 'antd';

interface IProps {
    openDrawer: boolean;
    setOpenDrawer: (v: boolean) => void;
}

const FilterDrawer = ({ openDrawer, setOpenDrawer }: IProps) => {
    const isMobile = window.innerWidth <= 768;

    return (
        <Drawer
            title="Bộ lọc cây"
            placement={isMobile ? "top" : "left"}
            width={isMobile ? "100vw" : "30vw"} // Chiều rộng cho PC, chiều cao cho mobile
            height={isMobile ? "50vh" : undefined} // Chỉ đặt chiều cao khi là mobile
            onClose={() => setOpenDrawer(false)}
            open={openDrawer}
        >
            <p>Chức năng lọc cây sẽ được thêm vào đây...</p>
            {/* Nút xác nhận */}
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <Button
                    type="primary"
                    onClick={() => setOpenDrawer(false)}
                    style={{
                        backgroundColor: '#007bff',
                        borderColor: '#007bff',
                        color: '#fff',
                        padding: '8px 16px',
                        fontSize: '16px',
                        borderRadius: '5px'
                    }}
                >
                    Xác nhận
                </Button>
            </div>
        </Drawer>
    );
};

export default FilterDrawer;

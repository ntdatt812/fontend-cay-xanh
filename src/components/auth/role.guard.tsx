import { useCurrentApp } from "../context/app.context";

interface AccessControlProps {
    allowedRoles: string[]; // Các role được phép xem nội dung
    children: React.ReactNode;
}

const AccessControl = ({ allowedRoles, children }: AccessControlProps) => {
    const { user } = useCurrentApp();

    if (!user || !allowedRoles.includes(user.role)) {
        return null; // Không hiển thị gì nếu không có quyền
    }

    return <>{children}</>;
};

export default AccessControl;

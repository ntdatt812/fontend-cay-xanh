export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface ILogin {
        access_token: string;
        user: {
            email: string,
            name: string,
            role: string,
            id: string,
        }
    }

    interface IRegister {
        _id: string;
        email: string;
        name: string;
    }

    interface IUser {
        email: string,
        name: string,
        role: string,
        avatar: string,
        id: string,
    }

    interface IFetchAccount {
        user: IUser
    }

    interface IUserTable {
        _id: string,
        name: string,
        email: string,
        avatar: string;
        role: string,
        createdAt: Date,
        updatedAt: Date,
    }

    interface ITreeTable {
        _id: string;
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
        createdBy: IUser;
        createdAt: string;
        updatedAt: string;
    }
}

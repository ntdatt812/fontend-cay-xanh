import axios from 'services/axios.customize'

export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password })
}

export const registerAPI = (name: string, email: string, password: string) => {
    const urlBackend = "/api/v1/auth/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { name, email, password })
}

export const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend)
}

export const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend)
}

export const getUserAPI = (query: string) => {
    const urlBackend = `/api/v1/users?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}

export const createUserAPI = (name: string, email: string,
    password: string) => {
    const urlBackend = "/api/v1/users";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        { name, email, password })
}

export const updateUserAPI = (_id: string, name: string, email: string) => {
    const urlBackend = "/api/v1/users";
    return axios.patch<IBackendRes<IRegister>>(urlBackend,
        { _id, name, email })
}

export const deleteUserAPI = (_id: string) => {
    const urlBackend = `/api/v1/users/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const getTreesAPI = (query: string) => {
    const urlBackend = `/api/v1/trees?${query}`;
    return axios.get<IBackendRes<IModelPaginate<ITreeTable>>>(urlBackend)
}
export const uploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileUpload', fileImg);
    return axios<IBackendRes<{
        fileName: string
    }>>({
        method: 'post',
        url: '/api/v1/files/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_type": folder
        },
    });
}

export const createTreeAPI = (tencayxanh: string, chieucao: number, hientrang: string, hinhanh: string,
    khuvuc: string, lat: string, lng: string, mota: string, namtrong: number, sohieu: string) => {
    const urlBackend = "/api/v1/trees";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        {
            tencayxanh, chieucao, hientrang, hinhanh,
            khuvuc, lat, lng, mota, namtrong, sohieu
        })
}

export const updateTreeAPI = (_id: string, tencayxanh: string, chieucao: number, hientrang: string, hinhanh: string,
    khuvuc: string, lat: string, lng: string, mota: string, namtrong: number, sohieu: string) => {
    const urlBackend = `/api/v1/trees/${_id}`;
    return axios.patch<IBackendRes<IRegister>>(urlBackend,
        {
            tencayxanh, chieucao, hientrang, hinhanh,
            khuvuc, lat, lng, mota, namtrong, sohieu
        })
}

export const deleteTreeAPI = (_id: string) => {
    const urlBackend = `/api/v1/trees/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const getAllTreesWithoutPaginateAPI = () => {
    const urlBackend = `/api/v1/trees/all`;
    return axios.get<IBackendRes<ITreeTable[]>>(urlBackend)
}

export const getTreeByIdAPI = (_id: string) => {
    const urlBackend = `/api/v1/trees/${_id}`;
    return axios.get<IBackendRes<ITreeTable>>(urlBackend)
}
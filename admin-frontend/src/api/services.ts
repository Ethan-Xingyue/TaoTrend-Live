import axios from 'axios'

const api = axios.create({
  baseURL: '/api/admin',
  timeout: 10000,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 认证
export const adminLogin = (data: { username: string; password: string }) =>
  api.post('/login/', data)

export const adminLogout = () => api.post('/logout/')

export const adminCheck = () => api.get('/check/')

// 数据统计
export const getDashboard = () => api.get('/dashboard/')

// 用户管理
export const getUsers = (params?: { page?: number; size?: number; keyword?: string }) =>
  api.get('/users/', { params })

export const deleteUser = (userId: string) => api.delete(`/users/${userId}/`)

// 商品管理
export const getProducts = (params?: {
  page?: number
  size?: number
  keyword?: string
  category_id?: number
}) => api.get('/products/', { params })

export const updateProduct = (id: number, data: any) => api.put(`/products/${id}/`, data)

export const deleteProduct = (id: number) => api.delete(`/products/${id}/delete/`)

// 主播管理
export const getAnchors = (params?: {
  page?: number
  size?: number
  keyword?: string
  platform?: string
}) => api.get('/anchors/', { params })

export const updateAnchor = (id: number, data: any) => api.put(`/anchors/${id}/`, data)

export const deleteAnchor = (id: number) => api.delete(`/anchors/${id}/delete/`)

// 直播管理
export const getLivestreams = (params?: {
  page?: number
  size?: number
  keyword?: string
  platform?: string
}) => api.get('/livestreams/', { params })

export const deleteLivestream = (id: number) => api.delete(`/livestreams/${id}/delete/`)

// 品类管理
export const getCategories = () => api.get('/categories/')

export default api

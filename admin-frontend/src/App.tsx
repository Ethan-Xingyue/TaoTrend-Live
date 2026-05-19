import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserList from './pages/UserList'
import ProductList from './pages/ProductList'
import AnchorList from './pages/AnchorList'
import LivestreamList from './pages/LivestreamList'
import CategoryList from './pages/CategoryList'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="anchors" element={<AnchorList />} />
        <Route path="livestreams" element={<LivestreamList />} />
        <Route path="categories" element={<CategoryList />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App

import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, User, Home, Package } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">E-Commerce</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Home className="h-5 w-5 inline mr-1" />
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Products
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="text-gray-600 hover:text-gray-900 p-2 rounded-md"
              >
                <ShoppingCart className="h-6 w-6" />
              </Link>
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 p-2 rounded-md"
              >
                <User className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 E-Commerce Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout 
import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();
  
  return (
    <aside className="w-full lg:w-64 bg-white border-r border-gray-200 h-auto lg:h-screen lg:sticky lg:top-0 overflow-auto">
      <div className="flex flex-col h-full">
        {/* Logo and App Title */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800 flex items-center">
            <i className="ri-quill-pen-line mr-2 text-primary"></i>
            BlogCraft
          </h1>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link href="/">
                <a className={`flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 ${location === '/' ? 'bg-gray-100' : ''}`}>
                  <i className="ri-dashboard-line mr-3 text-primary"></i>
                  Dashboard
                </a>
              </Link>
            </li>
            <li>
              <Link href="/editor">
                <a className={`flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 ${location === '/editor' ? 'bg-gray-100' : ''}`}>
                  <i className="ri-add-line mr-3 text-primary"></i>
                  New Blog
                </a>
              </Link>
            </li>
            <li>
              <Link href="/blogs">
                <a className={`flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 ${location.startsWith('/blogs') ? 'bg-gray-100' : ''}`}>
                  <i className="ri-file-list-3-line mr-3 text-primary"></i>
                  All Blogs
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
              <span>JS</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">John Smith</p>
              <button className="text-xs text-gray-500 hover:text-primary">Sign out</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

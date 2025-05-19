# BlogCraft - Full Stack Blog Editor

A modern full-stack blog editor application with auto-save functionality and a seamless user experience.

## 📝 Features

- **Rich Blog Editor**: Create and edit blog posts with title, content, and tags
- **Auto-Save**: Automatically saves drafts after 5 seconds of inactivity
- **Draft Management**: Save as draft or publish when you're ready
- **Blog Organization**: View all blogs with filtering options for drafts and published content
- **Responsive Design**: Works well on mobile and desktop devices

## 🛠️ Technology Stack

### Frontend
- React.js
- TailwindCSS
- ShadcnUI Components
- Wouter (lightweight routing)
- TanStack React Query (data fetching)
- Lucide React (icons)

### Backend
- Node.js with Express.js
- In-memory storage (can be easily extended to MongoDB, PostgreSQL, etc.)
- RESTful API architecture

### Shared
- TypeScript for type safety
- Zod for schema validation
- Drizzle ORM for database interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

1. Start the development server
```bash
npm run dev
```

The application will be available at http://localhost:5000

## 📁 Project Structure

```
webDevHub/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage interface
│   └── vite.ts             # Vite integration
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts           # Database schema with Drizzle
└── package.json            # Project configuration
```

## 🔄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/blogs | Get all blogs |
| GET    | /api/blogs/:id | Get blog by ID |
| POST   | /api/blogs/save-draft | Save or update a draft |
| POST   | /api/blogs/publish | Publish a blog |
| PUT    | /api/blogs/:id | Update a blog |
| DELETE | /api/blogs/:id | Delete a blog |

## ✨ Key Application Features

### Auto-Save Functionality
The application automatically saves your blog as a draft after 5 seconds of inactivity. This ensures your work is never lost and provides a seamless writing experience.

### Blog Management
- **Create**: Start a new blog from scratch
- **Edit**: Update existing blogs
- **Save as Draft**: Store your work in progress
- **Publish**: Make your blog available to the world
- **Filter**: View all blogs, just drafts, or only published content

### Tag System
Add and remove tags from your blogs for better organization. Tags are added by typing and pressing Enter.

## 🔍 Future Enhancements

- User authentication
- Rich text editor with formatting
- Image upload functionality
- Categories for blogs
- Search functionality with advanced filters
- Comments and social sharing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with ShadcnUI components
- Icons from Lucide React
- Routing with Wouter
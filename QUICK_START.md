# 🚀 Quick Start Guide

## Running the App

```bash
# Navigate to the React app folder
cd react-app

# Start the development server
npm run dev
```

Open your browser to: **http://localhost:5173**

---

## Project Structure

```
react-app/
├── src/
│   ├── pages/          # Your pages (Home, Login, Account, etc.)
│   ├── components/     # Reusable components (Header, Footer)
│   ├── styles/         # All CSS files
│   └── utils/          # Config and data files
└── public/
    └── images/         # All images
```

---

## Key Files

- `src/App.jsx` - Main app with all routes
- `src/pages/Home.jsx` - Homepage
- `src/pages/Login.jsx` - Login/Signup
- `src/pages/Account.jsx` - User profile
- `src/components/Header.jsx` - Navigation header
- `src/components/Footer.jsx` - Footer section
- `src/utils/config.js` - Backend API configuration
- `src/utils/data.js` - Destinations & categories data

---

## Available Routes

| URL | Page |
|-----|------|
| / | Home |
| /login | Login/Signup |
| /account | User Profile |
| /nearby-place | Place Details |
| /search-results | Search Results |

---

## Making Changes

### Add a new page:
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/new-page" element={<NewPage />} />
   ```

### Update styling:
- Edit CSS files in `src/styles/`

### Change backend URL:
- Edit `src/utils/config.js`

---

## Build for Production

```bash
npm run build
```

Files will be in the `dist/` folder.

---

## Troubleshooting

**Images not showing?**
- Check they're in `public/images/`
- Use `/images/filename.ext` in code

**Backend not connecting?**
- Make sure backend runs on port 5001
- Check `src/utils/config.js`

---

That's it! You're ready to go! 🎉

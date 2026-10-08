# E-Waste Intelligence System

## Intelligent E-Waste Classification and Recycling Recommendation System

A complete GUI for the SCMS AI & Data Science Department's Mini Project (CDD 324).

---

## 📁 Project Structure

```
ewaste-system/
│
├── login.html          # Login/Signup page
├── login-styles.css    # Login page styling
├── login-script.js     # Login page functionality
├── index.html          # Main application HTML
├── styles.css          # Main app styling and animations
├── script.js           # Main app JavaScript functionality
└── README.md           # This file
```

---

## 🚀 How to Run

### Method 1: Direct Browser Opening
1. Download all 6 files (login.html, login-styles.css, login-script.js, index.html, styles.css, script.js)
2. Place them in the same folder
3. Double-click `login.html` to start with the login page
4. Or double-click `index.html` to go directly to the main app

### Method 2: VS Code with Live Server
1. Open VS Code
2. Install "Live Server" extension by Ritwick Dey
3. Open the project folder in VS Code
4. Right-click on `login.html`
5. Select "Open with Live Server"
6. Browser will automatically open at http://localhost:5500

### Method 3: Python HTTP Server
1. Open terminal in the project folder
2. Run: `python -m http.server 8000`
3. Open browser and go to: http://localhost:8000/login.html

---

## ✨ Features

### 🔐 Login Page Features
- **Dual Authentication**: Login and Sign Up in one interface
- **Tab Navigation**: Smooth switching between Login/Signup forms
- **Password Strength Meter**: Real-time password strength indicator
- **Show/Hide Password**: Toggle password visibility
- **Remember Me**: Option to stay logged in
- **Social Authentication**: Google and GitHub login buttons (demo)
- **Forgot Password**: Password reset functionality (demo)
- **Form Validation**: Email format and password matching validation
- **Responsive Design**: Works perfectly on all devices
- **Animated Side Panel**: Engaging feature showcase

### 🎨 UI/UX Features
- **Cyberpunk Eco-Tech Design**: Futuristic interface with animated grid background
- **Drag & Drop Upload**: Easy image upload with visual feedback
- **Real-time Preview**: See uploaded images instantly
- **Smooth Animations**: Professional transitions and loading effects
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🤖 AI Simulation Features
- **Category Classification**: 7+ e-waste categories
- **Confidence Scoring**: Visual confidence meter with percentages
- **Condition Assessment**: Automatic condition detection
- **Material Breakdown**: Detailed composition analysis
- **Economic Valuation**: Recovery value estimation in ₹
- **Smart Recommendations**: Context-aware recycling advice
- **Environmental Impact**: CO₂, water, and energy savings

### 📊 Supported Categories
1. Mobile Devices
2. Keyboards
3. PCBs (Printed Circuit Boards)
4. Batteries
5. Cables
6. Monitors
7. Appliances

---

## 💻 Technology Stack

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Advanced animations and gradients
- **Vanilla JavaScript**: No frameworks required

### Design Elements
- **Fonts**: 
  - Orbitron (Display/Headers)
  - Space Mono (Body/Code)
- **Color Scheme**:
  - Primary: #00ff88 (Neon Green)
  - Secondary: #0066ff (Electric Blue)
  - Accent: #ff3366 (Hot Pink)
  - Dark Theme Background

### Animations
- Grid scrolling background
- Floating particles
- Card hover effects
- Loading spinners
- Confidence bar fills
- Smooth scrolling

---

## 📝 How to Use

### Login Page
1. **Open Application**
   - Start by opening `login.html`
   - See the beautiful login/signup interface

2. **Sign Up (First Time Users)**
   - Click the "Sign Up" tab
   - Enter your full name
   - Enter email address
   - Create a password (minimum 8 characters)
   - Watch the password strength meter
   - Confirm your password
   - Accept Terms & Conditions
   - Click "Create Account"

3. **Login (Returning Users)**
   - Enter your email address
   - Enter your password
   - Toggle "Remember me" if desired
   - Click "Login"

4. **Alternative Login**
   - Use "Google" or "GitHub" buttons for social login (demo)
   - Click "Forgot password?" to reset (demo)

5. **Access Main App**
   - After successful login, you'll be redirected to the main E-Waste classification system

### Main Application

1. **Upload Image**
   - Click the upload zone OR drag & drop an e-waste image
   - Supported formats: JPG, PNG
   - Max size: 10MB

2. **Analyze**
   - Click "🔍 Analyze E-Waste" button
   - Wait 3 seconds for AI simulation
   - Results appear automatically

3. **View Results**
   - Classification category and confidence
   - Material composition breakdown
   - Economic recovery value
   - Recycling recommendations
   - Environmental impact

4. **Try Again**
   - Click × button to remove image
   - Upload a new image to test different results

---

## 🎯 Demo Data

The system includes realistic demo data for 7 categories:

### Example: Mobile Device
- **Materials**: Copper (35%), Aluminum (25%), Gold (5%), etc.
- **Value**: ₹850 estimated recovery
- **Impact**: Saves 1,200L water, reduces 15kg CO₂
- **Recommendations**: Battery removal, data sanitization, component recovery

Each category has unique:
- Material compositions
- Economic values
- Environmental impacts
- Recycling recommendations

---

## 🔧 Customization

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #00ff88;    /* Main accent color */
    --secondary: #0066ff;  /* Secondary color */
    --accent: #ff3366;     /* Highlight color */
}
```

### Add New Categories
Edit `ewasteData` object in `script.js`:
```javascript
const ewasteData = {
    'Your Category': {
        materials: [...],
        totalValue: 1000,
        condition: 'Good',
        // ... more properties
    }
};
```

### Modify Animations
Adjust animation timings in `styles.css`:
```css
@keyframes gridScroll {
    /* Modify duration from 20s */
}
```

---

## 📱 Browser Compatibility

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Opera 76+

---

## 🎓 Project Team

**Developed by:**
- Nandana Prakash
- Rayyan Fathima
- Rishdan Musadik
- Mohamed Sanad Sabeer

**Batch**: 2023-2027
**Department**: Artificial Intelligence and Data Science
**Institution**: SCMS School of Engineering and Technology

**Project Guides:**
- Mrs. Anu Joseph (Assistant Professor)
- Mrs. Binu John (Assistant Professor)

---

## 📌 Notes for Development

### Current Status: Frontend Demo
This is a frontend demonstration with simulated AI results. For production:

1. **Backend Integration**
   - Replace `setTimeout()` with actual API calls
   - Connect to Python Flask/FastAPI backend
   - Integrate trained CNN models (MobileNet/ResNet)

2. **Real AI Processing**
   - Upload image to server
   - Run classification model
   - Return actual predictions
   - Calculate real material compositions

3. **Database**
   - Store classification history
   - Track recycling statistics
   - User accounts and preferences

### API Integration Example
```javascript
// Replace in script.js
analyzeBtn.addEventListener('click', async () => {
    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    
    const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    displayResults(result.category);
});
```

---

## 🐛 Troubleshooting

**Images not loading?**
- Ensure all 3 files are in the same folder
- Check file names match exactly (case-sensitive)

**Styles not applied?**
- Verify `styles.css` is in the same directory
- Check browser console for errors (F12)

**JavaScript not working?**
- Ensure `script.js` is in the same directory
- Check browser console for errors
- Try hard refresh (Ctrl+F5)

**Fonts not loading?**
- Requires internet connection for Google Fonts
- Check firewall/proxy settings

---

## 📄 License

This project is developed as part of academic curriculum at SCMS School of Engineering and Technology.

---

## 🌟 Future Enhancements

- [ ] Backend API integration
- [ ] Real CNN model deployment
- [ ] User authentication
- [ ] History/analytics dashboard
- [ ] Mobile app version
- [ ] QR code generation for tracking
- [ ] Multi-language support
- [ ] Recycling center locator map

---

## 📧 Contact

For questions or contributions, contact the development team through:
- SCMS Engineering Department
- AI & Data Science Faculty

---

**Last Updated**: February 2025
**Version**: 1.0.0 (Frontend Demo)

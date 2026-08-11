# Motilal Oswal Financial Services - Web Application

A modern, high-performance, and responsive web application for **Motilal Oswal Financial Services**, optimized for instant execution and seamless **Vercel deployment**.

---

## 🚀 Features & Capabilities

- **⚡ Lightning-Fast Performance**: Zero bloated tracker overhead, optimized assets, preconnected Google Fonts, and 100% self-contained stylesheets.
- **📱 Fully Responsive Design**: Flawless layout across Mobile (320px+), Tablet, Laptop, and Desktop screens.
- **🔍 Live Search & Filtering**: Instant category-based search filtering across Stocks, Indices, Futures & Options, Articles, Reports, US Stocks, and Mutual Funds.
- **💼 Interactive Demat Registration Flow**: Real-time form validation (10-digit Indian phone numbers starting with 6-9, full name) with simulated 4-digit OTP verification modal and success states.
- **📈 Interactive Financial SIP & Wealth Calculator**: Real-time wealth projections with monthly investment, return rate (p.a.), and tenure sliders, live visual ratios, and formatted INR currency outputs.
- **🎠 Highlights Carousel Slider**: Touch-swipe enabled hero carousel with autoplay, manual navigation arrows, pause/play toggle, and slide indicator dots.
- **📱 Mobile Navigation Drawer**: Smooth slide-in navigation drawer with backdrop blur and accessible keyboard controls (`Escape` to close).
- **🔒 Modals & Sticky Demat Bar**: Interactive "Open Demat Account" modal, "Client Login" modal, and bottom floating demat bar with smooth reveal on scroll.
- **🛡️ Vercel Deployment Ready**: Pre-configured `vercel.json` with security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) and static asset caching.

---

## 🛠️ Project Structure

```
├── index.html                   # Core semantic HTML5 entry point
├── vercel.json                  # Vercel routing, headers, and caching config
├── package.json                 # Project dependencies & scripts
├── assets/
│   ├── css/                     # Modular & enhanced stylesheets
│   │   ├── styles.css           # Core typography & layout
│   │   ├── header.css           # Navigation & sticky navbar
│   │   ├── landing-demat-form.css # Demat lead form styling
│   │   ├── link-cards.css       # Investment options grid
│   │   ├── carousel.css         # Hero highlights slider
│   │   ├── enhancements.css     # SIP calculator, modals, drawer, animations
│   │   └── footer.css           # Regulatory notices & A-Z directory
│   ├── js/
│   │   └── main.js              # Complete ES6+ interactivity
│   ├── images/                  # High-res banners, logos, and media files
│   └── icons/                   # Clean SVGs and iconography
```

---

## 💻 Running Locally

### Option 1: Using Node / npm
```bash
npm install
npm run dev
```

### Option 2: Using Python HTTP Server
```bash
python -m http.server 3000
```
Open `http://localhost:3000` in your web browser.

---

## ☁️ Deploying to Vercel

### Method 1: Using Vercel CLI
```bash
npx vercel
```
Follow the prompts and select default settings.

### Method 2: Via GitHub / Git Repository
1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import the repository into your **[Vercel Dashboard](https://vercel.com/new)**.
3. Keep Framework Preset as **Other** (Root directory `./`).
4. Click **Deploy**. Vercel will deploy the site instantly with zero build configuration required!

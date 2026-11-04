# 💳 Prisma Bank

> A payments dashboard built with **plain HTML, CSS and JavaScript**.
> Academic project developed during the **1st semester of college**.

![Status](https://img.shields.io/badge/status-planning-yellow)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 📌 About the project

**Prisma Bank** is the design of a **payments dashboard**: a panel where the user can see their balance, sales, recent transactions and other financial information in a clear, visual way.

The idea is to take inspiration from payment platforms that already exist (such as [AmploPay](https://www.amplopay.com.br)) and build **our own version** with its own visual identity.

⚠️ **Important:** this project is **visual only (front-end)**. There will be no database, no real login and no real payments. Every number and piece of information on the screen will be **fake data**, used only to make the design look as close as possible to a real system.

---

## 🎯 Goals

- Practice page structure with **HTML**.
- Learn how to style and lay out pages with **CSS** (Flexbox and Grid).
- Use **JavaScript** to make the page a bit more interactive.
- Work as a team using **Git and GitHub**.
- Build a good-looking project for our portfolio. 🚀

---

## 🛠️ Technologies

| Technology | What we'll use it for |
|------------|-----------------------|
| **HTML5** | Page structure (menu, cards, tables, etc.) |
| **CSS3** | Colors, fonts, layout, responsiveness and simple animations |
| **JavaScript** | Basic interactions (open/close menu, switch tabs, show/hide balance...) |

We won't use frameworks (like React, Bootstrap or Tailwind). The goal is to learn the fundamentals first.

---

## 🖥️ What the dashboard will include

This is what we **plan** to build. It may change a bit during development.

### 1. Sidebar
- Prisma Bank logo
- Links: **Dashboard**, **Transactions**, **Payments**, **Customers**, **Reports**, **Settings**
- **Log out** button

### 2. Header
- Welcome message (e.g. *"Hi, John 👋"*)
- Search field
- Notifications icon
- User photo/avatar

### 3. Summary cards
- 💰 **Available balance** (with a button to show/hide the amount 👁️)
- 📈 **Sales today / this month**
- ⏳ **Amount to receive**
- 🔁 **Number of transactions**

### 4. Sales chart
- A simple chart showing sales for the week or month
  *(can be made with CSS bars or a simple library, if the professor allows it)*

### 5. Recent transactions table
- Columns: **Customer**, **Date**, **Method** (Pix, Card, Boleto), **Amount** and **Status**
- Color-coded status:
  - 🟢 Approved
  - 🟡 Pending
  - 🔴 Declined

### 6. Quick actions
- Buttons like **Generate Pix**, **Create payment link**, **Withdraw** and **Transfer**
  *(visual only, or opening a simple modal/pop-up)*

### 7. Responsiveness
- The layout should work well on **desktop**, **tablet** and **mobile**.

---

## ✨ JavaScript interactions (planned)

Simple things we want to do with JS:

- [ ] Show/hide the balance when clicking the eye icon
- [ ] Open and close the sidebar on mobile
- [ ] Toggle between **light mode** and **dark mode** 🌙
- [ ] Filter the transactions table by status
- [ ] Open a modal when clicking "Generate Pix"
- [ ] Show the current date in the header

---

## 📁 Folder structure (planned)

```
PrismaBank/
├── index.html        # Main dashboard page
├── css/
│   └── style.css     # Site styles
├── js/
│   └── script.js     # JavaScript interactions
├── img/              # Logo, icons and images
└── README.md         # This file
```

---

## 🎨 Visual identity (initial idea)

- **Name:** Prisma Bank — "prisma" (prism) suggests light and color, so the idea is to use **gradients** in the design.
- **Colors:** purple/blue tones with gradient accents, on a dark or light background.
- **Font:** something modern and clean, like *Poppins* or *Inter* (Google Fonts).
- **Style:** rounded cards, soft shadows and plenty of white space.

*(We still need to pick the final palette.)*

---

## 🗺️ Development steps

- [x] Create the GitHub repository
- [x] Write the README
- [ ] Choose colors, fonts and logo
- [ ] Sketch the layout (on paper or in Figma)
- [ ] Build the HTML structure
- [ ] Style it with CSS
- [ ] Make it responsive
- [ ] Add the JavaScript interactions
- [ ] Review and publish (e.g. GitHub Pages)

---

## ▶️ How to run the project

Since it's just HTML, CSS and JS, there's nothing to install:

1. Download or clone the repository:
   ```bash
   git clone https://github.com/gildonetto/PrismaBank.git
   ```
2. Open the project folder.
3. Double-click `index.html` to open it in your browser.

> 💡 Tip: in VS Code, the **Live Server** extension reloads the page automatically every time you save.

---

## 👥 Team

| Name | GitHub |
|------|--------|
| Gildo Neto | [@gildonetto](https://github.com/gildonetto) |
| *(add team members)* | |

---

## 📚 Notes

This is an **academic** project made for study purposes. Prisma Bank **is not a real bank** and is not affiliated with any financial institution. AmploPay was used only as a **design inspiration reference**.

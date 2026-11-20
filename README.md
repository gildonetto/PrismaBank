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

- [x] Show/hide the balance when clicking the eye icon
- [x] Open and close the sidebar on mobile
- [x] Toggle between **light mode** and **dark mode** 🌙
- [ ] Filter the transactions table by status
- [ ] Open a modal when clicking "Generate Pix"
- [x] Show the current date in the header

---

## 📁 Folder structure

```
PrismaBank/
├── index.html        # The whole bank in one page: home, Pix, transfers,
│                     # pay, top-up, statement, cards, settings and receipt.
│                     # Only one screen shows at a time (index.html#extrato, etc.)
├── login.html        # Login page
├── cadastro.html     # Sign-up page
├── script.js         # The bank's JavaScript (data, screens, Pix, statement...)
├── comum.js          # Shared by the 3 pages: theme, input masks, password check
├── css/
│   ├── style-1.css   # Site styles (all screens, dark and light theme)
│   └── cadastro.css  # Extra styles for the sign-up page
├── favicon.svg       # Logo (also the browser tab icon)
├── qr.svg            # QR code on the Pix screen
├── manifest.json     # Lets the phone install the site as an app
├── icones/           # App icons (180, 192 and 512 px)
└── README.md         # This file
```

---

## ⚙️ How it works

**One page, many screens.** Every screen in `index.html` is a `<main data-tela="...">`. The function `mostrarTela()` in `script.js` reads the end of the address (`#extrato`, `#pix`...) and shows only that screen. Because each screen has its own address, the browser's back button works.

**All the data lives in one object.** The balance, transactions, contacts, bills and notifications are all inside `dados`, at the top of `script.js`. `mostrarTudo()` redraws the screen from it, so after a Pix, the balance, the statement and the chart all change together.

**The browser remembers.** When the page closes, `dados` is saved in `localStorage`. Dates are stored as "days from today", so the sample data never gets old. *Settings → Restaurar dados de exemplo* erases what was saved and starts over.

**Sending money.** Pix, transfers, bills and top-ups follow the same path:

1. `enviar()` checks the balance and builds the operation.
2. The "Confira os dados" screen shows it before anything happens.
3. `concluir()` takes the money out, adds it to the statement and opens the receipt.

A bill paid for a future date becomes *Agendado* and only leaves the balance on that day.

**Sign-up → bank.** `cadastro.html` sends the name, e-mail and phone in the address (`index.html?nome=...`), and the bank reads them with `URLSearchParams`. The password fields have no `name`, so they are never sent anywhere.

**Shared code.** `comum.js` loads in the `<head>` of the three pages:
- **Theme:** the first visit follows the computer's light/dark setting, and after that it remembers the user's choice.
- **Masks:** `formatar()` adds the spaces, dashes and parentheses while you type (phone, account, bill code).
- **Passwords:** sign-up checks that the two passwords match.

**Keyboard and errors.**
- **Enter** opens the focused item; **Esc** closes the menu and the notifications.
- Form errors appear in Portuguese right on the field (no `alert()` windows).

---

## 🎨 Visual identity

- **Name:** Prisma Bank. The logo is a simple prism on a blue square.
- **Colors:** one solid blue (`#2f5fe0`) for buttons, links and highlights, on a dark background, with a light theme as an option.
- **Font:** *IBM Plex Sans* (Google Fonts).
- **Style:** flat cards with thin borders, no gradients or heavy shadows, so the numbers stand out.

---

## 🗺️ Development steps

- [x] Create the GitHub repository
- [x] Write the README
- [x] Choose colors, fonts and logo
- [ ] Sketch the layout (on paper or in Figma)
- [x] Build the HTML structure
- [x] Style it with CSS
- [x] Make it responsive
- [x] Add the JavaScript interactions
- [ ] Review and publish (e.g. GitHub Pages)

---

## ▶️ How to run the project

Since it's just HTML, CSS and JS, there's nothing to install:

1. Download or clone the repository:
   ```bash
   git clone https://github.com/gildonetto/PrismaBank.git
   ```
2. Open the project folder.
3. Double-click `index.html` to open it in your browser. It opens the bank dashboard. "Sair da conta" in Settings goes to the login page (`login.html`), which links to the sign-up page (`cadastro.html`).

> 💡 Tip: in VS Code, the **Live Server** extension reloads the page automatically every time you save.

---

## 👥 Team

| Name | GitHub |
|------|--------|
| Gildo Neto | [@gildonetto](https://github.com/gildonetto) |
| Bruno César | |
| João Pedro | |
| Juan Soares | |
| Rafael Rodrigues | |

---

## 📚 Notes

This is an **academic** project made for study purposes. Prisma Bank **is not a real bank** and is not affiliated with any financial institution. AmploPay was used only as a **design inspiration reference**.

# 💳 Prisma Bank

> A fake digital bank built with **plain HTML, CSS and JavaScript**.
> Academic project developed during the **1st semester of college**.

![Status](https://img.shields.io/badge/status-done-brightgreen)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 📌 About the project

**Prisma Bank** is a digital bank that works in the browser: you can sign up, see your balance, send a Pix, pay a bill, check the statement and pay the credit card bill. The balance and the statement change with every operation, and everything stays saved in the browser.

⚠️ **Important:** this is a **front-end only** project. There is no server, no database, no real login and no real money. Every number on the screen is **fake data**.

---

## 🎯 Goals

- Practice page structure with **HTML**.
- Style and lay out pages with **CSS** (Flexbox, Grid and media queries).
- Use **JavaScript** to make the bank actually work: data, screens, forms and calculations.
- Work as a team using **Git and GitHub**.

---

## 🛠️ Technologies

| Technology | What we used it for |
|------------|---------------------|
| **HTML5** | The three pages and every screen of the bank |
| **CSS3** | Colors, layout, dark and light theme, mobile layout and the printed receipt |
| **JavaScript** | Data, switching screens, sending money, the statement, masks and saving in the browser |

No frameworks or libraries (no React, Bootstrap or Tailwind). The only external thing is the *IBM Plex Sans* font, from Google Fonts.

---

## 🖥️ What the bank has

### Login and sign-up
- **Login** (`login.html`) and **sign-up** (`cadastro.html`) pages, each with its own animated illustration: a prism splitting light into colors (login) and a fan of cards (sign-up).
- Sign-up in **two steps** (your data, then the password), with a bar that shows the current step.
- While you type your name in the sign-up, it appears on the card next to the form.
- The fields are checked when you press the button. The error shows up in red right below the field, the cursor jumps to the first wrong one, and the message disappears as soon as it is fixed.
- **"Mostrar"** shows the password.
- The phone field formats itself while you type.
- The name typed in the sign-up appears in the bank (greeting, initials, card).

### Home (Início)
- Balance at the top, with an **eye button that hides every value** on the site.
- Greeting that changes with the time of day. The date is fixed on **25 November**, the presentation day.
- **Spending chart**: the last 6 months plus a lighter bar for this month so far.
- Credit card summary, a **savings box (Caixinha)** with a goal (for looks only: its buttons do nothing), latest transactions, upcoming bills and quick Pix contacts.
- **Notifications** bell, with a counter.

### Moving money
- **Pix**, **transfers**, **bill payments (boleto)** and **phone top-ups (recarga)**.
- Every operation goes through a **"Confira os dados"** screen before the money leaves.
- After confirming, a **receipt (comprovante)** opens, with an authentication code and a **"Salvar em PDF"** button.
- A transfer can **save the person as a favorite** (favorecido).
- If the amount is bigger than the balance, the error appears on the field itself.

### Statement (Extrato)
- Period buttons: **7 days, 30 days or everything**.
- Filters: **all, money in, money out**, plus a **search** by name or type.
- Transactions **grouped by day**; clicking any of them opens its receipt.
- Totals for money in, money out and the current balance.

### Cards (Cartões)
- The card with your name, the limit used and **paying the card bill** (fatura).

### Settings (Configurações)
- **"Meus dados"** shows the name, e-mail and phone from the sign-up.
- Switch between **dark and light theme**.
- **"Restaurar"** goes back to the sample data.
- **"Sair da conta"** goes to the login page.

### Support (Suporte)
- Service channels (chat, phone and ombudsman; the numbers are fake).
- **Frequently asked questions** about Pix, the card and the account. Each one opens and closes on click with the HTML `<details>` tag, without any JavaScript.
- Security tips and shortcuts to other screens.

### Everywhere
- Works on **desktop and mobile**: on small screens, the side menu becomes a bar at the bottom.
- Can be used with the **keyboard**: visible focus, **Enter** opens the selected item, **Esc** closes menus.

---

## 📁 Folder structure

```
PrismaBank/
├── index.html        # The whole bank in one page: home, Pix, transfers,
│                     # pay, top-up, statement, cards, settings, support and receipt.
│                     # Only one screen shows at a time (index.html#extrato, etc.)
├── login.html        # Login page
├── cadastro.html     # Sign-up page
├── script.js         # All the JavaScript: theme, masks, login/sign-up and the bank (data, screens, Pix...)
├── css/
│   ├── style-1.css   # Site styles (all screens, dark and light theme)
│   └── cadastro.css  # Login and sign-up pages (the prism and the fan of cards)
├── docs/
│   ├── favicon.svg   # Logo (also the browser tab icon)
│   ├── qr.svg        # QR code on the Pix screen
│   └── Prisma_Bank_Projeto.pdf  # Project document
└── README.md         # This file
```

---

## ⚙️ How it works

**One page, many screens.** Every screen in `index.html` is a `<main data-tela="...">`. The function `mostrarTela()` in `script.js` reads the end of the address (`#extrato`, `#pix`...) and shows only that screen. Because each screen has its own address, the browser's back button works.

**All the data lives in one object.** The balance, transactions, contacts, bills and notifications are all inside `dados`, at the top of `script.js`. `mostrarTudo()` redraws the screen from it, so after a Pix, the balance, the statement and the notifications all change together.

**The browser remembers.** At the end of `mostrarTudo()`, which runs after every change, `dados` is saved in `localStorage`. Dates are stored as days counted from 25 November, the presentation day (0 = that day, -1 = the day before), and `quando()` turns them into text ("Hoje", "23 nov"). *Configurações → Restaurar* erases what was saved and starts over.

**Sending money.** Pix, transfers, bills and top-ups follow the same path:

1. `enviar()` checks the balance and builds the operation.
2. The "Confira os dados" screen shows it before anything happens.
3. `concluir()` takes the money out, adds it to the statement and opens the receipt.

**Sign-up → bank.** `cadastro.html` sends the name, e-mail and phone in the address (`index.html?nome=...`), and the bank reads them with `URLSearchParams`. The password fields have no `name`, so they are never sent anywhere.

**One script for the three pages.** `script.js` loads in the `<head>` of every page, so the theme is applied before the page shows up. The bank starts with `iniciarBanco()`, called by a small `<script>` at the end of `index.html`: by then all the HTML exists, so the numbers are already in place the first time the page is drawn and nothing jumps around. Part 0 is shared:
- **Theme:** the first visit follows the computer's light/dark setting, and after that it remembers the user's choice.
- **Masks:** `formatar()` adds the spaces, dashes and parentheses while you type (phone, account, bill code).
- **Login and sign-up:** each field keeps its error message in `data-erro`. `conferir()` uses the browser's own rules (`required`, `type="email"`, `minlength`) and writes the message below the field. `trocarEtapa()` switches the two sign-up steps and `entrar()` opens the bank once everything is right.

**Errors.** Form errors appear in Portuguese right on the field (no `alert()` windows).

---

## 🗺️ Development steps

- [x] Create the GitHub repository
- [x] Write the README
- [x] Choose colors, fonts and logo
- [x] Build the HTML structure
- [x] Style it with CSS
- [x] Make it responsive
- [x] Add the JavaScript interactions
- [x] Save the data in the browser
- [ ] Present the project

---

## ▶️ How to run the project

Since it's just HTML, CSS and JS, there's nothing to install:

1. Download or clone the repository:
   ```bash
   git clone https://github.com/gildonetto/PrismaBank.git
   ```
2. Open the project folder.
3. Double-click `login.html` (or `index.html` to go straight to the bank) to open it in your browser.

> 💡 Tip: in VS Code, the **Live Server** extension reloads the page automatically every time you save.

---

## 🎨 Visual identity

- **Name:** Prisma Bank. The logo is a simple prism on a blue square.
- **Colors:** one solid blue (`#2f5fe0`) for buttons, links and highlights, on a dark background, with a light theme as an option.
- **Font:** *IBM Plex Sans* (Google Fonts).
- **Style:** flat cards with thin borders, no gradients or heavy shadows, so the numbers stand out.

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

This is an **academic** project made for study purposes. Prisma Bank **is not a real bank** and is not affiliated with any financial institution.

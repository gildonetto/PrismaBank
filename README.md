# PrismaBank
# 💳 Prisma Bank

> Dashboard de pagamentos feito com **HTML, CSS e JavaScript puro**.
> Projeto acadêmico desenvolvido no **1º período da faculdade**.

![Status](https://img.shields.io/badge/status-em%20planejamento-yellow)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 📌 Sobre o projeto

O **Prisma Bank** é o design de um **dashboard de pagamentos**, ou seja, um painel onde o usuário pode ver seu saldo, suas vendas, as transações recentes e outras informações financeiras de forma visual e organizada.

A ideia é se inspirar em plataformas de pagamento que já existem no mercado (como a [AmploPay](https://www.amplopay.com.br)) e criar a **nossa própria versão**, com identidade visual própria.

⚠️ **Importante:** este projeto é **apenas visual (front-end)**. Não terá banco de dados, login de verdade, nem pagamentos reais. Todos os números e informações mostrados na tela serão **dados fictícios**, só para deixar o design o mais próximo possível de um sistema real.

---

## 🎯 Objetivos

- Praticar a estrutura de páginas com **HTML**.
- Aprender a estilizar e organizar o layout com **CSS** (Flexbox e Grid).
- Usar **JavaScript** para deixar a página um pouco mais interativa.
- Trabalhar em equipe usando **Git e GitHub**.
- Criar um projeto bonito para colocar no portfólio. 🚀

---

## 🛠️ Tecnologias

| Tecnologia | Para que vamos usar |
|------------|---------------------|
| **HTML5** | Estrutura da página (menu, cards, tabelas, etc.) |
| **CSS3** | Cores, fontes, layout, responsividade e animações simples |
| **JavaScript** | Interações básicas (abrir/fechar menu, trocar abas, mostrar/ocultar saldo...) |

Não vamos usar frameworks (como React, Bootstrap ou Tailwind). A ideia é aprender a base primeiro.

---

## 🖥️ O que vai ter no dashboard

A planta abaixo é o que **pretendemos** fazer. Pode mudar um pouco durante o desenvolvimento.

### 1. Menu lateral (Sidebar)
- Logo do Prisma Bank
- Links: **Dashboard**, **Transações**, **Pagamentos**, **Clientes**, **Relatórios**, **Configurações**
- Botão de **Sair**

### 2. Cabeçalho (Header)
- Mensagem de boas-vindas (ex: *"Olá, João 👋"*)
- Campo de busca
- Ícone de notificações
- Foto/avatar do usuário

### 3. Cards de resumo
- 💰 **Saldo disponível** (com botão para mostrar/ocultar o valor 👁️)
- 📈 **Vendas do dia / do mês**
- ⏳ **Valores a receber**
- 🔁 **Quantidade de transações**

### 4. Gráfico de vendas
- Um gráfico simples mostrando as vendas da semana ou do mês
  *(pode ser feito com CSS/barras ou com uma biblioteca simples, se o professor permitir)*

### 5. Tabela de transações recentes
- Colunas: **Cliente**, **Data**, **Método** (Pix, Cartão, Boleto), **Valor** e **Status**
- Status com cores:
  - 🟢 Aprovado
  - 🟡 Pendente
  - 🔴 Recusado

### 6. Ações rápidas
- Botões como **Gerar Pix**, **Criar link de pagamento**, **Sacar** e **Transferir**
  *(apenas visuais, ou abrindo um modal/pop-up simples)*

### 7. Responsividade
- O layout deve funcionar bem no **computador**, no **tablet** e no **celular**.

---

## ✨ Interações com JavaScript (planejadas)

Coisas simples que queremos fazer com JS:

- [ ] Mostrar/ocultar o saldo ao clicar no ícone de olho
- [ ] Abrir e fechar o menu lateral no celular
- [ ] Alternar entre **modo claro** e **modo escuro** 🌙
- [ ] Filtrar a tabela de transações por status
- [ ] Abrir um modal ao clicar em "Gerar Pix"
- [ ] Mostrar a data atual no cabeçalho

---

## 📁 Estrutura de pastas (prevista)

```
PrismaBank/
├── index.html        # Página principal do dashboard
├── css/
│   └── style.css     # Estilos do site
├── js/
│   └── script.js     # Interações em JavaScript
├── img/              # Logo, ícones e imagens
└── README.md         # Este arquivo
```

---

## 🎨 Identidade visual (ideia inicial)

- **Nome:** Prisma Bank — o "prisma" lembra luz e cores, então a ideia é usar **gradientes** no visual.
- **Cores:** tons de roxo/azul com detalhes em gradiente, fundo escuro ou claro.
- **Fonte:** algo moderno e limpo, como *Poppins* ou *Inter* (Google Fonts).
- **Estilo:** cards com cantos arredondados, sombras suaves e bastante espaço em branco.

*(Ainda vamos definir a paleta final.)*

---

## 🗺️ Etapas do desenvolvimento

- [x] Criar o repositório no GitHub
- [x] Escrever o README
- [ ] Definir cores, fontes e logo
- [ ] Fazer um rascunho do layout (papel ou Figma)
- [ ] Montar a estrutura em HTML
- [ ] Estilizar com CSS
- [ ] Deixar responsivo
- [ ] Adicionar as interações com JavaScript
- [ ] Revisar e publicar (ex: GitHub Pages)

---

## ▶️ Como rodar o projeto

Como é só HTML, CSS e JS, não precisa instalar nada:

1. Baixe ou clone o repositório:
   ```bash
   git clone https://github.com/gildonetto/PrismaBank.git
   ```
2. Abra a pasta do projeto.
3. Dê dois cliques no arquivo `index.html` para abrir no navegador.

> 💡 Dica: no VS Code, a extensão **Live Server** atualiza a página automaticamente sempre que você salva.

---

## 👥 Equipe

| Nome | GitHub |
|------|--------|
| Gildo Neto | [@gildonetto](https://github.com/gildonetto) |
| *(adicionar integrantes)* | |

---

## 📚 Observações

Este é um projeto **acadêmico**, feito para fins de estudo. O Prisma Bank **não é um banco real** e não tem ligação com nenhuma instituição financeira. A AmploPay foi usada apenas como **referência de inspiração** para o layout.

# 🐾 Mundo Pets v2  
### 🌐 Arquitetura Completa com Next.js + Prisma + Supabase + IA  

![Banner](https://raw.githubusercontent.com/douglasmarianodasilva8877-commits/Mundo-Pets-V2/main/public/banner.png)

> O Mundo Pets é uma plataforma social e colaborativa dedicada ao universo pet — conectando tutores, ONGs, petshops e profissionais em um único ecossistema digital.

---

## 🚀 Tecnologias Principais
- ⚛️ **Next.js 14 (App Router)**
- 🧩 **TypeScript**
- 🐘 **Prisma ORM**
- 🧠 **Supabase (Banco e Autenticação)**
- 💬 **Tailwind CSS / ShadCN UI**
- 🔧 **Railway / Vercel (Deploy)**
- 🤖 **Integração com IA (em desenvolvimento)**

---

## 📁 Estrutura do Projeto

```bash
/aplicativo     → núcleo do app (frontend + rotas)
/componentes    → UI compartilhada e componentes dinâmicos
/lib            → bibliotecas e helpers globais
/páginas/api    → endpoints API (Next.js server actions)
/prisma         → esquema e migrações do banco
/trabalhador    → automações e jobs
# Clonar o repositório
git clone https://github.com/douglasmarianodasilva8877-commits/Mundo-Pets-V2.git

# Entrar na pasta
cd Mundo-Pets-V2

# Instalar dependências
npm install

# Configurar ambiente
cp .env.exemplo .env.local

# Rodar em modo de desenvolvimento
npm run dev

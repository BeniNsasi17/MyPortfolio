# Portfolio Personnel

Ce projet est un portfolio personnel moderne et animé, construit avec React, Tailwind CSS et Framer Motion. Il présente mes compétences, projets et expériences professionnelles de manière élégante et interactive.

## 🚀 Fonctionnalités

- Design moderne et responsive
- Animations fluides avec Framer Motion
- Mode sombre/clair intégré
- Formulaire de contact fonctionnel avec EmailJS
- Sections dynamiques pour présenter compétences, projets et expériences
- Optimisé pour les performances et le SEO

## 🛠️ Technologies Utilisées

- **React** - Bibliothèque front-end pour créer l'interface utilisateur
- **TypeScript** - Ajout du typage statique pour une meilleure qualité de code
- **Tailwind CSS** - Framework CSS utility-first pour le styling
- **Framer Motion** - Bibliothèque d'animations pour React
- **EmailJS** - Service d'envoi d'emails depuis le client

## 🔧 Installation & Configuration

1. Clonez ce dépôt:
```bash
git clone https://github.com/votre-utilisateur/portfolio.git
cd portfolio
```

2. Installez les dépendances:
```bash
npm install
```

3. Configurez EmailJS:
   - Créez un compte sur [EmailJS](https://www.emailjs.com/)
   - Créez un service email et un template
   - Remplacez les identifiants dans le fichier `src/pages/HomePage.tsx`:
   ```javascript
   const EMAILJS_SERVICE_ID = "votre_service_id";
   const EMAILJS_TEMPLATE_ID = "votre_template_id";
   const EMAILJS_PUBLIC_KEY = "votre_cle_publique";
   ```

4. Lancez le serveur de développement:
```bash
npm run dev
```

## 📦 Structure du Projet

```
portfolio/
├── public/                # Fichiers statiques (CV, images)
├── src/                   # Code source
│   ├── pages/             # Pages de l'application
│   │   └── HomePage.tsx   # Composant principal de la page d'accueil
│   ├── components/        # Composants réutilisables
│   ├── styles/            # Fichiers CSS et configuration Tailwind
│   └── assets/            # Images et autres ressources
├── package.json           # Dépendances et scripts
├── tsconfig.json          # Configuration TypeScript
├── tailwind.config.js     # Configuration Tailwind CSS
└── vercel.json            # Configuration pour le déploiement sur Vercel
```

## 🚀 Déploiement

Ce projet est configuré pour être déployé sur Vercel. Pour déployer:

1. Créez un compte sur [Vercel](https://vercel.com/)
2. Importez votre projet depuis GitHub
3. Configurez les variables d'environnement si nécessaire
4. Déployez!

Alternativement, vous pouvez utiliser la CLI Vercel:

```bash
# Installez la CLI Vercel
npm install -g vercel

# Déployez
vercel
```

## 🔄 Personnalisation

Pour personnaliser ce portfolio pour votre usage:

1. Remplacez le CV et la photo dans le dossier `/public`
2. Modifiez les informations personnelles dans `HomePage.tsx`
3. Ajoutez vos propres projets dans la section Projets
4. Mettez à jour la section Expérience avec votre parcours professionnel
5. Personnalisez les couleurs dans `tailwind.config.js`

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

Créé avec ❤️ par Beni Nsasi

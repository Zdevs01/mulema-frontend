# 🖤 Mulema – Application éducative mobile multilingue

Bienvenue dans **Mulema**, une application éducative mobile développée avec **React Native (Expo)** pour le frontend, et **Node.js + Express + MySQL** pour le backend.

Ce projet vise à promouvoir l’apprentissage multilingue à travers des leçons, des vidéos et des quiz interactifs.

---

## 📁 Structure du projet

Le projet est divisé en deux parties distinctes :

mulema/
│
├── frontend/ ← Application mobile (React Native + Expo)
│
└── backend/ ← Serveur API (Node.js + Express + MySQL)

markdown
Copier
Modifier

---

## ⚙️ Prérequis

### ✅ Général
- Node.js (v16 ou supérieur)
- npm
- 2 fenêtres de terminal / 2 IDE (un pour le backend, un pour le frontend)

### ✅ Backend
- XAMPP (ou tout autre serveur local MySQL)
- MySQL activé
- Créer une base de données `mulema` via **phpMyAdmin**
- Créer un fichier `.env` dans le dossier `backend/` avec les variables suivantes :

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD= (laisser vide si vous n’avez pas de mot de passe)
DB_DATABASE=mulema
DB_PORT=3306
🚀 Lancement du projet en local
1. 📡 Backend – Serveur Node.js
Ouvre un premier terminal ou IDE.

bash
Copier
Modifier
cd backend
npm install
node server.js
✅ Le serveur devrait démarrer sur http://localhost:5000
✅ La connexion MySQL doit s’afficher comme "Connexion réussie"

2. 📱 Frontend – Application React Native (Expo)
Ouvre un second terminal ou IDE.

bash
Copier
Modifier
cd frontend
npm install
npx expo start
🟢 Tu peux ensuite :

scanner le QR code avec Expo Go sur ton téléphone

utiliser un simulateur Android/iOS si installé

🛠 Fonctionnalités principales
Authentification des utilisateurs

Choix des langues

Accès à des leçons par niveau

Vidéos éducatives par thème

Profil utilisateur

Quiz et tests interactifs

🧪 Tester l’application
Assure-toi que le backend fonctionne (API et base de données connectées).

Lance le frontend via Expo.

Utilise l’application sur téléphone ou simulateur.

Donne ton retour ou ouvre une Issue si un bug est repéré !

🤝 Contributions
Tu peux forker le repo, proposer des améliorations ou signaler des bugs.
Merci de contribuer à ce projet éducatif 💡

📬 Contact
Pour toute question ou collaboration :
📧 693481655


📌 Notes
Ce projet est encore en développement.

Merci de garder les dépendances à jour.

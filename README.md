# Teranga Connect — Plateforme de Transport & Logistique (Prototype Démonstratif)

> **Simulation métier et prototype frontend d’une solution numérique de mise en relation dans le secteur du transport routier au Sénégal.**

---

## 1. Présentation du projet

**Teranga Connect** est une solution numérique conçue pour le transport routier et la logistique au Sénégal. Le projet vise à modéliser et optimiser la mise en relation opérationnelle entre :
- les **propriétaires de véhicules / transporteurs** cherchant à maximiser le taux d'utilisation de leur flotte ;
- les **chauffeurs professionnels** à la recherche de chargements fiables sur leurs corridors habituels ;
- les **opportunités de fret** (notamment sur les axes Dakar, Thiès, Kaolack, Touba, Saint-Louis, Tambacounda et Kidira).

L'un des axes centraux de Teranga Connect est la **réduction des retours à vide** grâce à l'identification de fret retour (« retour optimisé »), améliorant la rentabilité économique des transporteurs tout en fluidifiant les corridors nationaux et sous-régionaux.

> **Note importante sur le périmètre :**
> Cette version est un **prototype frontend démonstratif et une simulation métier**. Elle ne repose pas sur des données réelles, n'intègre pas de partenaires commerciaux réels et n'exécute pas de transactions financières réelles.

---

## 2. Fonctionnalités actuelles

L'application intègre l'ensemble des parcours et écrans nécessaires à la simulation complète d'une opération de transport :

* **Profils professionnels :** Espaces et fiches dédiés pour le propriétaire de camion (`M. Amadou Diallo - Transport Teranga Express`) et le chauffeur professionnel (`Ibrahima Ndiaye`).
* **Gestion de flotte :** Consultation du parc de véhicules, ajout de camions avec caractéristiques techniques (matricule, type de carrosserie, tonnage, port d'attache, localisation).
* **Catalogue d'opportunités de fret :** Liste des frets disponibles, recherche multi-critères, filtres par axe/carrosserie, détection des retours à vide optimisés, calculs économiques indicatifs.
* **Candidatures & manifestations d'intérêt :** Prise de contact par les chauffeurs sur les opportunités, transmission des motivations et des coordonnées.
* **Acceptation & contractualisation démo :** Validation des candidatures par le propriétaire, affectation d'un camion disponible et génération automatique de la mission.
* **Cycle macro de mission :** Transition structurée des statuts (`pending` → `accepted` → `in_progress` → `completed`).
* **Suivi opérationnel jalonné (Phase 7) :** Contrôle séquentiel strict de l'acheminement physique :
  1. Prise en charge sur site (`picked_up`)
  2. Mise en route sur le corridor (`in_transit`)
  3. Arrivée à destination (`arrived`)
  4. Livraison contradictoire & émargement (`delivered`)
* **Confirmation de livraison & récépissé :** Émargement avec identité du réceptionnaire, fonction, réserves éventuelles et génération d'un code de récépissé unique.
* **Console d'action selon le rôle actif (Phase 8) :** Isolation d'interface entre les actions du propriétaire (gestion de flotte, opportunités, acceptation) et celles du chauffeur (conduite opérationnelle des jalons de livraison).
* **Centre de notifications ciblé par rôle :** Notification en temps réel des événements métier avec filtrage strict (`driver`, `truck_owner`, `all`), gestion des statuts de lecture et compteurs automatiques.
* **Persistance locale & Démo Reset :** Stockage synchrone dans le `localStorage` du navigateur pour conserver l'état entre les sessions, avec un bouton de réinitialisation complète à l'état usine en un clic.

---

## 3. Workflow opérationnel complet

Le cycle d'une opération de transport sur Teranga Connect respecte le workflow déterministe suivant :

```text
Opportunité de fret publiée
           ↓
Manifestation d'intérêt / Candidature du chauffeur
           ↓
Examen & Acceptation par le propriétaire du camion
           ↓
Création de la mission de transport (avec code unique)
           ↓
Mission créée : [pending]
           ↓
Acceptation formelle de mission : [accepted]
           ↓
Démarrage du trajet : [in_progress]
           ↓
      ┌────────────────────────────────────────────────────────┐
      │          Suivi opérationnel séquentiel                 │
      │                                                        │
      │  1. Attente d'enlèvement   : [pending_pickup]          │
      │              ↓                                         │
      │  2. Prise en charge validée : [picked_up]              │
      │              ↓                                         │
      │  3. En route sur corridor   : [in_transit]             │
      │              ↓                                         │
      │  4. Arrivé à destination    : [arrived]                │
      │              ↓                                         │
      │  5. Livraison émargée       : [delivered]              │
      └────────────────────────────────────────────────────────┘
           ↓
Mission clôturée avec succès : [completed]
(Récépissé et bordereau de livraison horodatés générés)
```

---

## 4. Technologies & Stack technique

Les dépendances et versions utilisées correspondent exactement au `package.json` du projet :

| Technologie | Version | Rôle dans l'application |
| :--- | :--- | :--- |
| **React** | `19.2.8` | Bibliothèque UI et gestion des composants |
| **React DOM** | `19.2.8` | Rendu DOM pour React |
| **TypeScript** | `~6.0.2` | Typage statique strict et modèles de données métier |
| **Vite** | `^8.3.0` | Environnement de développement rapide et bundler de production |
| **Tailwind CSS** | `^4.3.3` | Framework de styles utilitaires moderne |
| **React Router** | `7.18.4` | Routage déclaratif côté client |
| **Lucide React** | `^1.48.0` | Bibliothèque d'icônes vectorielles cohérentes |
| **Oxlint** | `^1.81.0` | Linter ultra-rapide garantissant la qualité du code |
| **Web Storage API** | Standard | Persistance locale synchrone (`localStorage`) |

---

## 5. Installation & Exécution locale

### Prérequis
- **Node.js** : version 18.x ou supérieure recommandée
- **npm** : version 9.x ou supérieure

### Installation des dépendances
```bash
npm install
```

### Lancement du serveur de développement
```bash
npm run dev
```
Par défaut, l'application est accessible sur [http://localhost:5173/](http://localhost:5173/).

### Vérification de la qualité du code (Linting)
```bash
npm run lint
```

### Compilation TypeScript et Build de production
```bash
npm run build
```

### Prévisualisation locale du build
```bash
npm run preview
```

---

## 6. Guide de démonstration

### Scénario 1 : Parcours Propriétaire de camion
1. Ouvrez l'application et rendez-vous dans l'**Espace Propriétaire** (`/proprietaire`).
2. Consultez la flotte existante et cliquez sur **« Ajouter un véhicule »** pour enregistrer un nouveau camion démonstratif.
3. Cliquez sur **« Publier une opportunité »** pour proposer un fret sur un axe (ex: Dakar → Saint-Louis).
4. Rendez-vous dans l'onglet **« Candidatures »** pour examiner les manifestations d'intérêt des chauffeurs.
5. Cliquez sur **« Accepter la candidature »** : la mission est automatiquement générée et rattachée à un camion disponible.
6. Suivez en temps réel la progression de la mission sur `/missions/:id` en mode supervision.

### Scénario 2 : Parcours Chauffeur professionnel
1. Rendez-vous dans l'**Espace Chauffeur** (`/chauffeur`) ou dans le catalogue (`/opportunites`).
2. Activez votre disponibilité via l'interrupteur **« Disponible pour mission »**.
3. Consultez une opportunité (par exemple un retour optimisé Kaolack → Dakar) et cliquez sur **« Manifester mon intérêt »**.
4. Une fois la candidature acceptée par le propriétaire, accédez à la mission sur `/missions/:id`.
5. Si la mission est acceptée, cliquez sur **« Démarrer la mission »**.
6. Exécutez le suivi opérationnel pas-à-pas :
   - Étape 1 : **« Confirmer la prise en charge »** (chargement à l'origine).
   - Étape 2 : **« Prendre la route »** (transit sur corridor routier).
   - Étape 3 : **« Signaler l'arrivée »** (stationné au point de livraison).
   - Étape 4 : **« Confirmer la livraison »** (saisie du réceptionnaire, fonction et émargement).
7. Visualisez le bordereau final, le récépissé officiel et la clôture de mission.

---

## 7. Limites actuelles & Périmètre

Pour une transparence totale sur le niveau de maturité du projet :

* **Nature du projet :** Prototype frontend interactif / démonstrateur produit.
* **Données :** Jeux de données mockés représentatifs du corridor sénégalais.
* **Persistance :** Les données modifiées sont enregistrées localement dans votre navigateur (`localStorage`). Aucun serveur central ne stocke les données.
* **Authentification :** Pas d'authentification serveur (JWT, OAuth ou sessions). Le basculement entre les rôles Propriétaire et Chauffeur s'effectue via un sélecteur d'interface.
* **Paiements :** Les montants, avances carburant et commissions affichés sont purement indicatifs et calculés mathématiquement pour la simulation.
* **Supervision :** Les rôles Dispatcher et Administrateur ne disposent pas encore d'écrans de contrôle dédiés dans cette phase.

---

## 8. Déploiement

Ce projet est une Single Page Application (SPA) statique et peut être déployé directement sur n'importe quel hébergeur moderne :

- **Vercel** : Détection automatique de Vite (`npm run build`, dossier de sortie `dist`).
- **Netlify** : Build command `npm run build`, Publish directory `dist`, avec redirection SPA (`/* /index.html 200`).
- **Cloudflare Pages** : Framework preset `Vite`, output directory `dist`.
- **GitHub Pages** : Déploiement automatisable via GitHub Actions.

---

*Teranga Connect — Connecter les camions aux opportunités.*

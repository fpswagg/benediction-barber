# Bénédiction Barber - Site Vitrine

Site vitrine moderne pour le salon de coiffure **Bénédiction Barber** à Yaoundé, Cameroun.

## 🎨 Design

- **Style** : Urbain, minimaliste, contrasté
- **Palette** : Noir, blanc, dégradés de gris
- **Typographie** : Inter (corps) + Bebas Neue (titres)
- **Animations** : Micro-interactions fluides, transitions douces

## 🚀 Technologies

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS v4
- **UI Components** : shadcn/ui
- **Fonts** : Google Fonts (Inter, Bebas Neue)

## 📁 Structure du Projet

\`\`\`
benediction-barber/
├── app/
│   ├── page.tsx              # Page d'accueil avec hero
│   ├── services/page.tsx     # Services avec tarifs JSON
│   ├── equipe/page.tsx       # Équipe de barbiers
│   ├── galerie/page.tsx      # Galerie avant/après
│   ├── contact/page.tsx      # Contact + carte
│   ├── reservation/page.tsx  # Système de réservation
│   ├── layout.tsx            # Layout principal
│   └── globals.css           # Styles globaux + thème
├── components/
│   ├── navigation.tsx        # Navigation responsive
│   ├── footer.tsx            # Footer
│   └── ui/                   # Composants shadcn/ui
├── data/
│   ├── services.json         # Services et tarifs
│   ├── team.json             # Membres de l'équipe
│   └── gallery.json          # Items de galerie
└── public/                   # Images et assets
\`\`\`

## 📄 Pages

### 1. Accueil (`/`)
- Hero plein écran avec typographie forte
- Section "Pourquoi nous choisir"
- Aperçu des services
- Statistiques et CTA

### 2. Services (`/services`)
- Tarifs chargés depuis `data/services.json`
- Organisés par catégories (Coupes, Tresses, Soins, Forfaits)
- Prix en FCFA, durée, badges "Populaire"
- Bouton de réservation par service

### 3. Équipe (`/equipe`)
- Profils des barbiers avec photos
- Spécialités et années d'expérience
- Statut de disponibilité
- Réservation directe avec barbier

### 4. Galerie (`/galerie`)
- Transformations avant/après
- Effet de survol interactif
- Filtres par catégorie
- Images optimisées

### 5. Contact (`/contact`)
- Formulaire de contact
- Informations complètes (adresse, téléphone, email, horaires)
- Bouton WhatsApp direct
- Carte Google Maps intégrée

### 6. Réservation (`/reservation`)
- Formulaire complet de réservation
- Pré-sélection service/barbier via URL params
- Confirmation via WhatsApp
- Réservation express WhatsApp

## 🔧 Configuration

### Services (data/services.json)
Modifiez les services, prix et durées dans ce fichier. Structure :
\`\`\`json
{
  "categories": [
    {
      "id": "coupes",
      "name": "Coupes & Coiffures",
      "services": [
        {
          "id": "coupe-moderne",
          "name": "Coupe Moderne",
          "price": 3500,
          "duration": 45,
          "popular": true
        }
      ]
    }
  ]
}
\`\`\`

### Équipe (data/team.json)
Ajoutez ou modifiez les membres de l'équipe :
\`\`\`json
{
  "members": [
    {
      "id": "jean-paul",
      "name": "Jean-Paul Mbarga",
      "role": "Barbier Principal",
      "specialties": ["Dégradés", "Coupes modernes"],
      "experience": "10+ ans",
      "available": true
    }
  ]
}
\`\`\`

### WhatsApp
Remplacez le numéro de téléphone dans :
- `app/reservation/page.tsx` (ligne avec `wa.me/237600000000`)
- `app/contact/page.tsx` (fonction `handleWhatsApp`)

## 🎯 SEO Local

Le site est optimisé pour le référencement local à Yaoundé :
- Métadonnées avec mentions "Yaoundé" et "Cameroun"
- Mots-clés locaux dans les descriptions
- Balises Open Graph configurées
- Structure sémantique HTML5

## 🔮 Évolutions Futures

Le code est structuré pour faciliter l'intégration de :
- **Supabase** : Base de données pour réservations réelles
- **Système de booking complet** : Calendrier interactif, gestion des disponibilités
- **Paiements en ligne** : Intégration Stripe ou autre
- **Dashboard admin** : Gestion des réservations et services
- **Authentification** : Comptes clients avec historique

## 📱 Responsive

Design mobile-first avec breakpoints :
- Mobile : < 768px
- Tablet : 768px - 1024px
- Desktop : > 1024px

## 🎨 Personnalisation du Thème

Modifiez les couleurs dans `app/globals.css` :
\`\`\`css
:root {
  --background: oklch(1 0 0);      /* Blanc */
  --foreground: oklch(0.15 0 0);   /* Noir */
  --primary: oklch(0.15 0 0);      /* Noir primaire */
  /* ... autres tokens */
}
\`\`\`

## 📞 Contact

**Bénédiction Barber**
- Adresse : Quartier Bastos, Avenue Kennedy, Yaoundé
- Téléphone : +237 6XX XXX XXX
- Email : contact@benedictionbarber.cm
- Horaires : Lun-Sam 9h-20h | Dim 10h-18h

---

Développé avec ❤️ pour Bénédiction Barber, Yaoundé

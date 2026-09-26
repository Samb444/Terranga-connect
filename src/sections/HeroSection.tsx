import React from 'react'
import { Link } from 'react-router-dom'
import { Truck, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { CorridorVisual } from '../components/visual/CorridorVisual'

export const HeroSection: React.FC = () => {
  return (
    <section
      id="accueil"
      className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Éléments d'ambiance en arrière-plan */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Colonne de gauche : Proposition de valeur & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <Badge variant="amber" className="py-1 px-3 text-xs font-semibold">
                <Truck className="w-3.5 h-3.5" />
                <span>Transport &bull; Fret &bull; Réduction des retours à vide</span>
              </Badge>
              <Badge variant="outline" className="hidden sm:inline-flex py-1 px-3 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sénégal &bull; Réseau routier</span>
              </Badge>
            </div>

            {/* Titre requis mot pour mot */}
            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
            >
              Connecter les camions aux opportunités.
            </h1>

            {/* Texte requis mot pour mot */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Teranga Connect facilite la mise en relation entre propriétaires de camions et chauffeurs afin d'optimiser les trajets et de réduire les retours à vide.
            </p>

            {/* Deux CTA fonctionnels vers les espaces produit */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/proprietaire" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-amber-950/30"
                >
                  <Truck className="w-5 h-5 mr-1" />
                  <span>Je suis propriétaire de camion</span>
                </Button>
              </Link>

              <Link to="/chauffeur" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <UserCheck className="w-5 h-5 mr-1 text-amber-400" />
                  <span>Je suis chauffeur</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Repères contextuels clés */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Axe prioritaire</p>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">Corridors nationaux</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Objectif trajet</p>
                <p className="text-sm font-semibold text-emerald-400 mt-0.5">Rentabiliser l'aller-retour</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Cadre d'échange</p>
                <p className="text-sm font-semibold text-amber-400 mt-0.5">Professionnel &amp; direct</p>
              </div>
            </div>
          </div>

          {/* Colonne de droite : Visuel cohérent */}
          <div className="lg:col-span-5 w-full">
            <CorridorVisual />
          </div>
        </div>
      </div>
    </section>
  )
}

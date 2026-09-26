import React from 'react'
import { MapPin, Compass, Building2, Layers } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent } from '../components/ui/Card'
import { SENEGAL_LOGISTICS_HUBS } from '../data/constants'

export const AboutSection: React.FC = () => {
  return (
    <section
      id="a-propos"
      className="py-16 sm:py-24 relative overflow-hidden"
      aria-labelledby="about-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Présentation du projet */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="amber" className="py-1 px-3">
                <Compass className="w-3.5 h-3.5" />
                <span>À propos du projet</span>
              </Badge>
            </div>

            <h2
              id="about-title"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight"
            >
              Une initiative dédiée à l'efficience du transport routier au Sénégal.
            </h2>

            <div className="space-y-4 text-base text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">Teranga Connect</strong> est né d'un constat opérationnel récurrent : sur de nombreux corridors routiers sénégalais et sous-régionaux, des camions effectuent leur trajet de retour sans cargaison, ce qui entraîne une perte de valeur pour le propriétaire et pour le chauffeur.
              </p>
              <p>
                La plateforme a pour vocation d'établir une passerelle directe et moderne entre les propriétaires de camions disposant de capacités de fret et les chauffeurs en quête de missions coordonnées.
              </p>
              <p className="text-sm text-slate-400">
                En favorisant une meilleure visibilité des opportunités sur les trajets aller comme sur les retours, Teranga Connect contribue à optimiser la rentabilité de chaque kilomètre parcouru.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Plateforme indépendante en cours de développement, pensée pour s'intégrer progressivement aux réalités quotidiennes des professionnels du transport routier.
              </span>
            </div>
          </div>

          {/* Hubs et corridors cibles */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Carrefours logistiques de référence</h3>
                    <p className="text-xs text-slate-400">Pôles économiques et corridors routiers cibles</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Sénégal
                </span>
              </div>

              <div className="mt-5 space-y-2.5">
                {SENEGAL_LOGISTICS_HUBS.map((hub) => (
                  <Card
                    key={hub.city}
                    className="p-3.5 bg-slate-950/60 border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3"
                  >
                    <CardContent className="p-0 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {hub.city}
                      </span>
                    </CardContent>
                    <span className="text-xs text-slate-400 text-right">
                      {hub.role}
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

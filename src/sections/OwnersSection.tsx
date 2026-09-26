import React from 'react'
import {
  Truck,
  TrendingUp,
  FolderKanban,
  Target,
  BarChart3,
  Clock,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { OWNER_ADVANTAGES } from '../data/constants'

export const OwnersSection: React.FC = () => {
  const getFeatureIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Target className="w-5 h-5 text-amber-400" />
      case 1:
        return <TrendingUp className="w-5 h-5 text-amber-400" />
      case 2:
        return <BarChart3 className="w-5 h-5 text-emerald-400" />
      case 3:
        return <FolderKanban className="w-5 h-5 text-amber-400" />
      case 4:
      default:
        return <Clock className="w-5 h-5 text-amber-400" />
    }
  }

  return (
    <section
      id="proprietaires"
      className="py-16 sm:py-24 bg-slate-950/40 border-t border-slate-900"
      aria-labelledby="owners-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-800">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <Badge variant="amber" className="py-1 px-3">
                <Truck className="w-3.5 h-3.5" />
                <span>Pour les propriétaires de camions</span>
              </Badge>
            </div>

            <h2
              id="owners-title"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight"
            >
              Valorisez chaque trajet de votre camion.
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Une gamme de fonctionnalités cibles conçue pour offrir aux propriétaires de véhicules de fret une visibilité accrue sur la rentabilité de leur matériel roulant.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link to="/proprietaire">
              <Button variant="primary" size="sm" className="shadow-md shadow-amber-950/20">
                <Truck className="w-4 h-4 mr-1.5" />
                <span>Tester l'espace Propriétaire</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Grille des 5 avantages cibles */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OWNER_ADVANTAGES.map((item, index) => (
            <Card
              key={item.title}
              className="bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
            >
              <div>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    {getFeatureIcon(index)}
                  </div>
                  <Badge variant="outline" className="text-[11px] text-amber-400/90 border-amber-500/20 bg-amber-500/5">
                    {item.status}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-2">
                  <CardTitle className="text-base font-semibold text-white mb-2">
                    {item.title}
                  </CardTitle>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </div>

              <div className="p-6 pt-0 mt-4 border-t border-slate-800/50 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Profil Propriétaire</span>
                <span className="text-slate-300">Phase suivante</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

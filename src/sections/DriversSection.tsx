import React from 'react'
import {
  Compass,
  Eye,
  Handshake,
  MapPin,
  RotateCcw,
  UserCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { DRIVER_ADVANTAGES } from '../data/constants'

export const DriversSection: React.FC = () => {
  const getFeatureIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Compass className="w-5 h-5 text-amber-400" />
      case 1:
        return <Eye className="w-5 h-5 text-amber-400" />
      case 2:
        return <Handshake className="w-5 h-5 text-emerald-400" />
      case 3:
        return <MapPin className="w-5 h-5 text-amber-400" />
      case 4:
      default:
        return <RotateCcw className="w-5 h-5 text-emerald-400" />
    }
  }

  return (
    <section
      id="chauffeurs"
      className="py-16 sm:py-24 relative"
      aria-labelledby="drivers-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-800">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <Badge variant="amber" className="py-1 px-3">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Pour les chauffeurs routiers</span>
              </Badge>
            </div>

            <h2
              id="drivers-title"
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight"
            >
              Trouvez des opportunités adaptées à vos trajets.
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Un espace conçu pour donner aux chauffeurs une visibilité limpide sur les besoins de transport, sans dépendre de relais multiples ou imprécis.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link to="/chauffeur">
              <Button variant="secondary" size="sm" className="border-emerald-500/40 hover:bg-emerald-950/30">
                <UserCheck className="w-4 h-4 mr-1.5 text-emerald-400" />
                <span>Tester l'espace Chauffeur</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Grille des 5 points clés chauffeurs */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DRIVER_ADVANTAGES.map((item, index) => (
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
                <span>Espace Chauffeur</span>
                <span className="text-slate-300">Phase suivante</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

import React from 'react'
import {
  Coins,
  Percent,
  Truck,
  Fuel,
  Info,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { BUSINESS_MODEL_ITEMS } from '../data/constants'

export const BusinessModelSection: React.FC = () => {
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Percent className="w-5 h-5 text-amber-400" />
      case 1:
        return <Percent className="w-5 h-5 text-emerald-400" />
      case 2:
        return <Truck className="w-5 h-5 text-amber-400" />
      case 3:
      default:
        return <Fuel className="w-5 h-5 text-amber-400" />
    }
  }

  return (
    <section
      id="modele-economique"
      className="py-16 sm:py-24 relative"
      aria-labelledby="business-model-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2">
            <Badge variant="amber" className="py-1 px-3">
              <Coins className="w-3.5 h-3.5" />
              <span>Cadre financier prévisionnel</span>
            </Badge>
          </div>

          <h2
            id="business-model-title"
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight"
          >
            Modèle économique envisagé
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Aperçu des paramètres économiques actuellement à l’étude pour assurer la viabilité de la plateforme et rémunérer la valeur créée lors de chaque trajet.
          </p>

          {/* Avertissement explicite requis */}
          <div className="inline-flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/40 px-3.5 py-2 rounded-xl text-left max-w-xl mx-auto">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Note importante :</strong> Ces éléments représentent le modèle économique envisagé lors de la phase de conception, et non des conditions contractuelles définitives.
            </span>
          </div>
        </div>

        {/* Grille des 4 éléments strictement définis */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUSINESS_MODEL_ITEMS.map((item, index) => (
            <Card
              key={item.title}
              className="bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col justify-between"
            >
              <div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    {getIcon(index)}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Paramètre 0{index + 1}
                  </span>
                </CardHeader>

                <CardContent className="pt-2">
                  <div className="my-2">
                    <span className="text-3xl font-extrabold text-white tracking-tight block">
                      {item.rate}
                    </span>
                    <CardTitle className="text-sm font-semibold text-amber-400 mt-1">
                      {item.title}
                    </CardTitle>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mt-3">
                    {item.detail}
                  </p>
                </CardContent>
              </div>

              <div className="p-6 pt-0 mt-4 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
                <span>Statut</span>
                <span className="text-amber-400 font-medium">Envisagé</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

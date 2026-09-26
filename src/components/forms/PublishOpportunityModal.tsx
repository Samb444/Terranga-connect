import React, { useState } from 'react'
import { PlusCircle, CheckCircle2, RotateCcw } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { TRUCK_CATEGORIES, SENEGAL_CITIES } from '../../data/mockData'
import { useTransport } from '../../hooks/useTransport'
import type { TruckCategory } from '../../types'

interface PublishOpportunityModalProps {
  isOpen: boolean
  onClose: () => void
}

export const PublishOpportunityModal: React.FC<PublishOpportunityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { publishOpportunity } = useTransport()

  const [origin, setOrigin] = useState('Dakar')
  const [destination, setDestination] = useState('Thiès')
  const [cargoType, setCargoType] = useState('')
  const [weightTons, setWeightTons] = useState('15')
  const [truckCategory, setTruckCategory] = useState<TruckCategory>('plateau')
  const [departureDate, setDepartureDate] = useState('Dans 24h (Indicatif)')
  const [description, setDescription] = useState('')
  const [isReturnTrip, setIsReturnTrip] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setIsSuccess(false)
    setErrors({})
    setOrigin('Dakar')
    setDestination('Thiès')
    setCargoType('')
    setWeightTons('15')
    setTruckCategory('plateau')
    setDepartureDate('Dans 24h (Indicatif)')
    setDescription('')
    setIsReturnTrip(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!cargoType.trim()) {
      newErrors.cargoType = 'Le type de marchandise est obligatoire.'
    }

    if (!weightTons || isNaN(Number(weightTons)) || Number(weightTons) <= 0) {
      newErrors.weightTons = 'Veuillez saisir un poids valide en tonnes.'
    }

    if (!description.trim()) {
      newErrors.description = 'Une brève description du fret ou des conditions est requise.'
    }

    if (origin === destination) {
      newErrors.destination = "L'origine et la destination doivent être différentes."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const catObj = TRUCK_CATEGORIES.find((c) => c.value === truckCategory)
    const truckCategoryLabel = catObj ? catObj.label : 'Camion fret'

    publishOpportunity({
      origin,
      destination,
      cargoType: cargoType.trim(),
      weightTons: Number(weightTons),
      truckCategoryRequired: truckCategory,
      truckCategoryLabel,
      departureDate: departureDate.trim() || 'Date indicative',
      description: description.trim(),
      isReturnTrip,
    })

    setIsSuccess(true)
    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Publier une opportunité de transport"
      subtitle="Publiez un fret de démonstration. Il sera immédiatement consultable dans le catalogue des opportunités."
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-8 flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-white tracking-tight">
            Opportunité ajoutée à la démonstration.
          </h4>
          <p className="text-sm text-slate-300 max-w-md">
            Votre offre de fret pour le trajet{' '}
            <strong className="text-white">
              {origin} → {destination}
            </strong>{' '}
            est désormais active dans l'espace opportunités de la session.
          </p>
          <Badge variant="amber" className="text-xs mt-2">
            Prototype local &bull; Aucune diffusion serveur
          </Badge>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Publication locale dans le catalogue de démonstration</span>
            </span>
            <Badge variant="amber" className="text-[10px]">
              Démonstration
            </Badge>
          </div>

          {/* Origine et Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Ville d'origine (Chargement)"
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              options={SENEGAL_CITIES.map((c) => ({ value: c, label: c }))}
            />

            <Select
              label="Ville de destination (Déchargement)"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              error={errors.destination}
              options={SENEGAL_CITIES.map((c) => ({ value: c, label: c }))}
            />
          </div>

          {/* Marchandise & Poids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Type de marchandise"
              required
              placeholder="Ex : Ciment, Farine, Bobines, Produits maraîchers..."
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
              error={errors.cargoType}
            />

            <Input
              label="Poids estimé (en tonnes)"
              type="number"
              min="1"
              max="60"
              required
              value={weightTons}
              onChange={(e) => setWeightTons(e.target.value)}
              error={errors.weightTons}
              helperText="Ex : 10, 15, 25, 30 tonnes"
            />
          </div>

          {/* Type de camion & Date souhaitée */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Type de camion recherché"
              required
              value={truckCategory}
              onChange={(e) => setTruckCategory(e.target.value as TruckCategory)}
              options={TRUCK_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
            />

            <Input
              label="Date ou délai souhaité"
              required
              placeholder="Ex : Dans 24h, Fin de semaine, Mardi..."
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
          </div>

          {/* Option opportunité de retour */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <input
              type="checkbox"
              id="is-return-trip-checkbox"
              checked={isReturnTrip}
              onChange={(e) => setIsReturnTrip(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer"
            />
            <label
              htmlFor="is-return-trip-checkbox"
              className="text-xs text-slate-300 cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Marquer comme opportunité ciblée pour <strong>réduire un retour à vide</strong></span>
            </label>
          </div>

          {/* Description */}
          <Textarea
            label="Description et consignes particulières"
            required
            rows={3}
            placeholder="Précisez les conditions de chargement, l'accessibilité du site, le bâchage requis, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
          />

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="md" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" size="md">
              <span>Publier l'opportunité (Démo)</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

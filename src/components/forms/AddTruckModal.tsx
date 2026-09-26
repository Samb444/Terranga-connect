import React, { useState } from 'react'
import { Truck, CheckCircle2 } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { TRUCK_CATEGORIES, SENEGAL_CITIES } from '../../data/mockData'
import { useTransport } from '../../hooks/useTransport'
import type { TruckCategory } from '../../types'

interface AddTruckModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddTruckModal: React.FC<AddTruckModalProps> = ({ isOpen, onClose }) => {
  const { addTruck } = useTransport()

  const [category, setCategory] = useState<TruckCategory>('plateau')
  const [tonnage, setTonnage] = useState('15')
  const [matriculeSuffix, setMatriculeSuffix] = useState('D4')
  const [brandModel, setBrandModel] = useState('Volvo FMX 380')
  const [city, setCity] = useState('Dakar')
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setIsSuccess(false)
    setErrors({})
    setCategory('plateau')
    setTonnage('15')
    setMatriculeSuffix('D4')
    setBrandModel('Volvo FMX 380')
    setCity('Dakar')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!tonnage || isNaN(Number(tonnage)) || Number(tonnage) <= 0) {
      newErrors.tonnage = 'Veuillez saisir une capacité valide en tonnes.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const categoryObj = TRUCK_CATEGORIES.find((c) => c.value === category)
    const categoryLabel = categoryObj ? categoryObj.label : 'Camion fret'

    addTruck({
      matricule: `DK-****-${matriculeSuffix || 'XX'} [Fictif]`,
      category,
      categoryLabel,
      tonnageCapacity: Number(tonnage),
      brandModel: brandModel.trim() || 'Camion Démonstration',
      currentCity: city,
    })

    setIsSuccess(true)
    setTimeout(() => {
      handleClose()
    }, 1800)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Ajouter un camion à votre flotte"
      subtitle="Ajoutez un véhicule de démonstration pour tester la gestion de parc Teranga Connect."
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="py-8 flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white">Camion ajouté à la démonstration !</h4>
          <p className="text-xs text-slate-300 max-w-sm">
            Le véhicule a été ajouté à votre liste locale avec immatriculation fictive sécurisée.
          </p>
          <Badge variant="amber" className="text-xs mt-2">
            Donnée enregistrée localement pour cette session
          </Badge>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
            <Truck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Rappel démonstration :</strong> Ne saisissez jamais une vraie plaque
              d’immatriculation. Une mention fictive sera automatiquement ajoutée.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Type de carrosserie"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as TruckCategory)}
              options={TRUCK_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
            />

            <Input
              label="Capacité utile (tonnes)"
              type="number"
              min="1"
              max="60"
              required
              value={tonnage}
              onChange={(e) => setTonnage(e.target.value)}
              error={errors.tonnage}
              helperText="Ex : 10, 15, 25, 30 tonnes"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Marque et modèle indicatif"
              value={brandModel}
              onChange={(e) => setBrandModel(e.target.value)}
              placeholder="Ex : Renault Trucks, Mercedes Actros..."
            />

            <Select
              label="Ville / Hub de base actuel"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              options={SENEGAL_CITIES.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div className="space-y-1.5">
            <Input
              label="Suffixe d'immatriculation fictive"
              value={matriculeSuffix}
              onChange={(e) => setMatriculeSuffix(e.target.value.toUpperCase())}
              placeholder="Ex : D4, X1"
              helperText="Le numéro complet sera enregistré sous format masqué : DK-****-[Suffixe] [Fictif]"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="md" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" size="md">
              <span>Enregistrer le camion (Démo)</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

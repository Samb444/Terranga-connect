import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useTransport } from '../../hooks/useTransport'
import { SENEGAL_CITIES } from '../../data/mockData'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  role: 'truck_owner' | 'driver'
}

interface EditProfileFormProps {
  role: 'truck_owner' | 'driver'
  onClose: () => void
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ role, onClose }) => {
  const { owner, driver, updateOwnerProfile, updateDriverProfile, addNotification } =
    useTransport()

  const isOwner = role === 'truck_owner'

  // États locaux du formulaire initialisés directement depuis le state
  const [fullName, setFullName] = useState(isOwner ? owner.fullName : driver.fullName)
  const [phone, setPhone] = useState(isOwner ? owner.phone : driver.phone)
  const [city, setCity] = useState(isOwner ? owner.city : driver.currentCity)
  const [companyName, setCompanyName] = useState(owner.companyName)
  const [licenseType, setLicenseType] = useState(driver.licenseType)
  const [experienceYears, setExperienceYears] = useState(driver.experienceYears.toString())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isOwner) {
      updateOwnerProfile({
        fullName: fullName.trim() || owner.fullName,
        phone: phone.trim() || owner.phone,
        city: city.trim() || owner.city,
        companyName: companyName.trim() || owner.companyName,
      })
      addNotification({
        type: 'system',
        title: 'Profil Propriétaire mis à jour',
        message: 'Vos informations de démonstration ont été enregistrées localement.',
        targetRole: 'truck_owner',
      })
    } else {
      updateDriverProfile({
        fullName: fullName.trim() || driver.fullName,
        phone: phone.trim() || driver.phone,
        currentCity: city.trim() || driver.currentCity,
        licenseType: licenseType.trim() || driver.licenseType,
        experienceYears: Number(experienceYears) || driver.experienceYears,
      })
      addNotification({
        type: 'system',
        title: 'Profil Chauffeur mis à jour',
        message: 'Vos informations de démonstration ont été enregistrées localement.',
        targetRole: 'driver',
      })
    }

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom complet */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Nom complet de démonstration
        </label>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ex : Mamadou Diop"
          required
        />
      </div>

      {/* Entreprise (si propriétaire) */}
      {isOwner && (
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Raison sociale / Société de transport
          </label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Ex : Transports Teranga Fret SARL"
            required
          />
        </div>
      )}

      {/* Localisation / Base */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          {isOwner ? 'Base logistique / Ville' : 'Ville de résidence principale'}
        </label>
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ex : Dakar, Thiès, Kaolack..."
          list="cities-list"
          required
        />
        <datalist id="cities-list">
          {SENEGAL_CITIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      {/* Téléphone fictif */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Téléphone masqué (Fictif)
        </label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+221 77 *** ** 00 [Fictif]"
          required
        />
        <p className="text-[11px] text-slate-400 mt-1">
          ⚠️ Donnée démonstrative. Ne saisissez aucun numéro personnel réel.
        </p>
      </div>

      {/* Champs spécifiques chauffeur */}
      {!isOwner && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Type de permis (Fictif)
            </label>
            <Input
              value={licenseType}
              onChange={(e) => setLicenseType(e.target.value)}
              placeholder="Ex : Permis C/E Poids Lourd"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Années d'expérience (Fictif)
            </label>
            <Input
              type="number"
              min="1"
              max="40"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="Ex : 8"
            />
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
        <Button variant="ghost" size="md" type="button" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="primary" size="md" type="submit">
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  )
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  role,
}) => {
  const isOwner = role === 'truck_owner'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isOwner ? 'Modifier le profil Propriétaire' : 'Modifier le profil Chauffeur'}
      subtitle="Les modifications sont conservées localement dans votre navigateur pour cette démonstration."
      maxWidth="lg"
    >
      {isOpen && <EditProfileForm key={`${role}-${isOpen}`} role={role} onClose={onClose} />}
    </Modal>
  )
}

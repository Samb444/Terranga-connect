import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useTransport } from '../../hooks/useTransport'
import { SENEGAL_CITIES } from '../../data/mockData'
import type { UserRole } from '../../types'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  role: UserRole
}

interface EditProfileFormProps {
  role: UserRole
  onClose: () => void
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ role, onClose }) => {
  const {
    owner,
    driver,
    shipper,
    updateOwnerProfile,
    updateDriverProfile,
    updateShipperProfile,
    addNotification,
  } = useTransport()

  const isOwner = role === 'truck_owner'
  const isShipper = role === 'shipper'

  // États locaux du formulaire initialisés directement depuis le state
  const [fullName, setFullName] = useState(
    isOwner ? owner.fullName : isShipper ? shipper.fullName : driver.fullName
  )
  const [phone, setPhone] = useState(
    isOwner ? owner.phone : isShipper ? shipper.phone : driver.phone
  )
  const [city, setCity] = useState(
    isOwner ? owner.city : isShipper ? shipper.city : driver.currentCity
  )
  const [companyName, setCompanyName] = useState(
    isOwner ? owner.companyName : shipper.companyName
  )
  const [companyType, setCompanyType] = useState(shipper.companyType)
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
    } else if (isShipper) {
      updateShipperProfile({
        fullName: fullName.trim() || shipper.fullName,
        phone: phone.trim() || shipper.phone,
        city: city.trim() || shipper.city,
        companyName: companyName.trim() || shipper.companyName,
        companyType: companyType.trim() || shipper.companyType,
      })
      addNotification({
        type: 'system',
        title: 'Profil Chargeur mis à jour',
        message: 'Vos informations de donneur d’ordre ont été enregistrées localement.',
        targetRole: 'shipper',
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

      {/* Entreprise (si propriétaire ou chargeur) */}
      {(isOwner || isShipper) && (
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {isOwner ? 'Raison sociale / Société de transport' : 'Raison sociale / Entité Donneur d’ordre'}
          </label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Ex : Transports Teranga Fret SARL"
            required
          />
        </div>
      )}

      {/* Secteur d'activité (si chargeur) */}
      {isShipper && (
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Secteur d'activité logistique / Donneur d'ordre
          </label>
          <Input
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value)}
            placeholder="Ex : Cimenterie & BTP, Négoce Import-Export..."
            required
          />
        </div>
      )}

      {/* Localisation / Base */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          {isOwner
            ? 'Base logistique / Ville'
            : isShipper
            ? 'Siège / Site d’expédition principal'
            : 'Ville de résidence principale'}
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
      {!isOwner && !isShipper && (
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
  const title =
    role === 'truck_owner'
      ? 'Modifier le profil Propriétaire'
      : role === 'shipper'
      ? 'Modifier le profil Donneur d’ordre (Chargeur)'
      : 'Modifier le profil Chauffeur'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Les modifications sont conservées localement dans votre navigateur pour cette démonstration."
      maxWidth="lg"
    >
      {isOpen && <EditProfileForm key={`${role}-${isOpen}`} role={role} onClose={onClose} />}
    </Modal>
  )
}

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Building2,
  Award,
  RotateCcw,
  Route,
  CheckCircle2,
} from 'lucide-react'
import { useTransport } from '../hooks/useTransport'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { ProfileStats } from '../components/profile/ProfileStats'
import { EditProfileModal } from '../components/profile/EditProfileModal'
import { ResetDemoModal } from '../components/modals/ResetDemoModal'
import { Header } from '../layouts/Header'
import { Footer } from '../layouts/Footer'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { DiscoveryModal } from '../components/modals/DiscoveryModal'

export const ProfilePage: React.FC = () => {
  const { owner, driver, activeRole, setActiveRole } = useTransport()
  const [selectedRole, setSelectedRole] = useState<'truck_owner' | 'driver'>(activeRole)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false)

  const isOwner = selectedRole === 'truck_owner'

  const handleToggleRole = () => {
    const nextRole = isOwner ? 'driver' : 'truck_owner'
    setSelectedRole(nextRole)
    setActiveRole(nextRole)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070d1e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header onOpenJoinModal={() => setIsDiscoveryOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation & Titre */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <Link
              to={isOwner ? '/proprietaire' : '/chauffeur'}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à l'espace {isOwner ? 'Propriétaire' : 'Chauffeur'}</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Profil Utilisateur</span>
              <Badge variant="amber" className="text-xs">
                Démonstration
              </Badge>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/missions">
              <Button variant="secondary" size="sm" className="text-xs">
                <Route className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                <span>Mes missions</span>
              </Button>
            </Link>
            <Link to="/notifications">
              <Button variant="secondary" size="sm" className="text-xs">
                <span>Centre de notifications</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* En-tête du profil avec avatar et actions */}
        <ProfileHeader
          role={selectedRole}
          owner={owner}
          driver={driver}
          onEditClick={() => setIsEditModalOpen(true)}
          onToggleRole={handleToggleRole}
        />

        {/* Statistiques en temps réel calculées depuis le state */}
        <ProfileStats role={selectedRole} />

        {/* Détails des informations personnelles et professionnelles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <User className="w-4 h-4 text-amber-400" />
              <span>Informations personnelles (Démonstration)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Nom complet</span>
                <span className="font-bold text-white text-sm">
                  {isOwner ? owner.fullName : driver.fullName}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Téléphone de contact</span>
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isOwner ? owner.phone : driver.phone}</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Localisation principale</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isOwner ? owner.city : driver.currentCity}</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-400">Statut du compte</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Vérifié [Session Démo]</span>
                </span>
              </div>
            </div>
          </div>

          {/* Informations professionnelles adaptées au rôle */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              {isOwner ? (
                <Building2 className="w-4 h-4 text-amber-400" />
              ) : (
                <Award className="w-4 h-4 text-emerald-400" />
              )}
              <span>
                {isOwner
                  ? 'Activité de transport & flotte'
                  : 'Compétences & Habilitations de conduite'}
              </span>
            </h3>

            {isOwner ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Raison sociale</span>
                  <span className="font-bold text-white">{owner.companyName}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Base d'attache</span>
                  <span className="font-semibold text-white">{owner.city}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Véhicules enregistrés</span>
                  <span className="font-semibold text-amber-300">
                    {owner.truckCount} camions déclarés
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Zone d'intervention</span>
                  <span className="font-semibold text-white">
                    Sénégal & Corridors Sous-Régionaux
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Permis de conduire</span>
                  <span className="font-bold text-white">{driver.licenseType}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Expérience déclarée</span>
                  <span className="font-semibold text-emerald-300">
                    {driver.experienceYears} ans de conduite poids lourd
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <span className="text-slate-400 block">Corridors de prédilection</span>
                  <div className="flex flex-wrap gap-1.5">
                    {driver.preferredCorridors.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700/60"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400">Disponibilité actuelle</span>
                  <Badge variant={driver.status === 'available' ? 'success' : 'outline'}>
                    {driver.status === 'available' ? 'Disponible pour mission' : 'En repos'}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Paramètres & Réinitialisation Démonstration */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Gestion de la session de démonstration</span>
              </h3>
              <p className="text-xs text-slate-400">
                Vous pouvez réinitialiser toutes les modifications locales enregistrées (camions
                ajoutés, missions créées, candidatures, notifications) pour retrouver l'état initial
                du prototype.
              </p>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => setIsResetModalOpen(true)}
              className="text-xs border-rose-500/30 text-rose-300 hover:bg-rose-500/10 hover:text-white shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-2 text-rose-400" />
              <span>Réinitialiser la démonstration</span>
            </Button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modales */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        role={selectedRole}
      />

      <ResetDemoModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />

      <DiscoveryModal
        isOpen={isDiscoveryOpen}
        onClose={() => setIsDiscoveryOpen(false)}
      />
    </div>
  )
}

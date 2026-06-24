import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l\'équipe VideoSave pour toute question ou signalement.',
};

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 prose prose-slate">
      <h1>Contact</h1>
      <p>Pour toute question, demande de retrait de contenu (DMCA) ou signalement d'abus, contactez-nous :</p>

      <div className="not-prose bg-white border border-gray-200 rounded-2xl p-8 space-y-4 shadow-sm">
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">Email général</p>
          <a href="mailto:contact@videosave.app" className="text-blue-600 font-semibold text-lg">contact@videosave.app</a>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">Signalement DMCA / droits d'auteur</p>
          <a href="mailto:dmca@videosave.app" className="text-blue-600 font-semibold text-lg">dmca@videosave.app</a>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">Délai de réponse</p>
          <p className="text-gray-700">Nous répondons sous 48 heures ouvrées.</p>
        </div>
      </div>

      <h2>Demande de retrait de contenu</h2>
      <p>Si vous êtes titulaire de droits d'auteur et souhaitez signaler une utilisation abusive, votre demande doit inclure :</p>
      <ul>
        <li>Une description précise du contenu protégé concerné</li>
        <li>L'URL de la source originale</li>
        <li>Vos coordonnées complètes</li>
        <li>Une déclaration attestant que vous êtes bien l'ayant droit</li>
      </ul>
      <p>Envoyez votre demande à <strong>dmca@videosave.app</strong>. Nous traitons toutes les demandes valides sous 48 heures.</p>

      <h2>Protection des données (RGPD)</h2>
      <p>Pour toute demande relative à vos données personnelles (accès, rectification, suppression), contactez-nous à <strong>contact@videosave.app</strong>.</p>
    </main>
  );
}

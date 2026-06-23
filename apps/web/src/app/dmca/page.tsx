import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMCA — Retrait de contenu',
  description: 'Politique DMCA de VideoSave — signalement et retrait de contenu protégé.',
};

export default function DmcaPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 prose prose-invert prose-slate">
      <h1>DMCA & Retrait de contenu</h1>

      <p>VideoSave respecte les droits de propriété intellectuelle. Nous ne stockons aucun contenu médiatique de façon permanente — les fichiers sont supprimés dans les 30 minutes suivant leur génération.</p>

      <h2>Signalement</h2>
      <p>Si vous êtes ayant droit d'un contenu et souhaitez signaler une utilisation abusive, envoyez votre demande à :</p>
      <p><strong>dmca@videosave.app</strong></p>

      <p>Votre demande doit inclure :</p>
      <ul>
        <li>Une description du contenu protégé</li>
        <li>L'URL source concernée</li>
        <li>Vos coordonnées et une déclaration sous serment d'être l'ayant droit</li>
      </ul>

      <h2>Délai de traitement</h2>
      <p>Nous traitons les demandes valides dans un délai de 48 heures ouvrées.</p>
    </main>
  );
}

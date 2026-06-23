import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "CGU de VideoSave — conditions d'utilisation du service de conversion vidéo.",
};

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 prose prose-invert prose-slate">
      <h1>Conditions Générales d'Utilisation</h1>
      <p className="text-slate-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

      <h2>1. Objet</h2>
      <p>VideoSave est un service de conversion de vidéos en ligne destiné à un usage strictement personnel et privé.</p>

      <h2>2. Utilisation autorisée</h2>
      <p>Vous pouvez utiliser VideoSave uniquement pour convertir des contenus dont vous êtes l'ayant droit ou dont la licence autorise explicitement la copie.</p>

      <h2>3. Propriété intellectuelle</h2>
      <p>VideoSave ne stocke pas les fichiers au-delà de 30 minutes. Nous n'hébergeons pas de contenu protégé. Chaque utilisateur est seul responsable du respect des droits d'auteur.</p>

      <h2>4. Limitation de responsabilité</h2>
      <p>Le service est fourni "tel quel", sans garantie de disponibilité continue. Nous ne saurions être tenus responsables d'une interruption de service.</p>

      <h2>5. Publicité</h2>
      <p>VideoSave affiche des publicités via des réseaux tiers (Google AdSense ou équivalent) afin de financer le service.</p>

      <h2>6. Modifications</h2>
      <p>Nous nous réservons le droit de modifier ces CGU à tout moment. L'utilisation du service vaut acceptation des CGU en vigueur.</p>
    </main>
  );
}

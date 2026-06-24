import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "CGU de VideoSave — conditions d'utilisation du service de conversion vidéo gratuit.",
};

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 prose prose-slate">
      <h1>Conditions Générales d'Utilisation</h1>
      <p className="text-gray-500">Dernière mise à jour : 24 juin 2026</p>

      <h2>1. Présentation du service</h2>
      <p>VideoSave est un outil de conversion et de téléchargement de vidéos en ligne, accessible à l'adresse <strong>web-production-4fc5f.up.railway.app</strong>. Le service est fourni gratuitement et financé par la publicité.</p>

      <h2>2. Acceptation des conditions</h2>
      <p>En utilisant VideoSave, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser le service.</p>

      <h2>3. Usage autorisé — Usage personnel uniquement</h2>
      <p>VideoSave est destiné exclusivement à un <strong>usage personnel et privé</strong>. Vous vous engagez à :</p>
      <ul>
        <li>N'utiliser le service que pour des contenus dont vous êtes l'auteur ou l'ayant droit.</li>
        <li>Ne pas utiliser le service à des fins commerciales ou de redistribution.</li>
        <li>Respecter les droits d'auteur et la propriété intellectuelle de tiers.</li>
        <li>Respecter les conditions d'utilisation des plateformes sources (YouTube, TikTok, Instagram, etc.).</li>
      </ul>

      <h2>4. Contenus interdits</h2>
      <p>Il est strictement interdit d'utiliser VideoSave pour :</p>
      <ul>
        <li>Télécharger ou distribuer des contenus protégés par le droit d'auteur sans autorisation.</li>
        <li>Reproduire, vendre ou exploiter commercialement tout contenu tiers.</li>
        <li>Toute activité illégale au regard du droit applicable.</li>
      </ul>

      <h2>5. Responsabilité de l'utilisateur</h2>
      <p>L'utilisateur est seul responsable de l'usage qu'il fait du service et des contenus qu'il télécharge. VideoSave agit en tant que simple outil technique et décline toute responsabilité quant au respect des droits d'auteur par ses utilisateurs.</p>

      <h2>6. Absence de stockage permanent</h2>
      <p>VideoSave ne conserve aucun fichier médiatique de façon permanente. Tous les fichiers convertis sont automatiquement supprimés de nos serveurs dans un délai maximum de 30 minutes après leur génération.</p>

      <h2>7. Publicité</h2>
      <p>Le service gratuit est financé par des publicités diffusées via Google AdSense. En utilisant VideoSave, vous acceptez la diffusion de publicités. Les utilisateurs Premium bénéficient d'une expérience sans publicité.</p>

      <h2>8. Disponibilité du service</h2>
      <p>VideoSave est fourni "tel quel", sans garantie de disponibilité continue. Nous nous réservons le droit de modifier, suspendre ou interrompre le service à tout moment, sans préavis ni responsabilité.</p>

      <h2>9. Propriété intellectuelle</h2>
      <p>L'interface, le code source, les graphismes et le contenu éditorial de VideoSave sont la propriété exclusive de leurs auteurs et protégés par le droit de la propriété intellectuelle. Toute reproduction est interdite sans autorisation.</p>

      <h2>10. Droit applicable</h2>
      <p>Les présentes CGU sont soumises au droit français. Tout litige sera porté devant les tribunaux compétents.</p>

      <h2>11. Contact</h2>
      <p>Pour toute question relative aux présentes CGU : <strong>contact@videosave.app</strong></p>
    </main>
  );
}

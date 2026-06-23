import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité de VideoSave — comment nous traitons vos données.',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 prose prose-invert prose-slate">
      <h1>Politique de Confidentialité</h1>
      <p className="text-slate-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

      <h2>Données collectées</h2>
      <p>Nous enregistrons uniquement l'adresse IP de l'utilisateur à des fins de rate-limiting et de lutte contre les abus. Ces données sont supprimées après 30 jours.</p>

      <h2>Cookies</h2>
      <p>VideoSave utilise des cookies nécessaires au fonctionnement et des cookies publicitaires de tiers (Google AdSense). Vous pouvez refuser les cookies publicitaires via votre navigateur.</p>

      <h2>Publicité</h2>
      <p>Google AdSense peut utiliser des cookies pour personnaliser les annonces. Consultez la politique de confidentialité de Google pour plus d'informations.</p>

      <h2>Fichiers convertis</h2>
      <p>Les fichiers convertis sont stockés temporairement sur nos serveurs (maximum 30 minutes) avant d'être supprimés automatiquement.</p>

      <h2>Vos droits (RGPD)</h2>
      <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Contactez-nous via la page DMCA pour toute demande.</p>
    </main>
  );
}

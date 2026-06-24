import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité de VideoSave — comment nous traitons vos données personnelles et utilisons les cookies.',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 prose prose-slate">
      <h1>Politique de Confidentialité</h1>
      <p className="text-gray-500">Dernière mise à jour : 24 juin 2026</p>

      <h2>1. Responsable du traitement</h2>
      <p>VideoSave est édité par un particulier. Pour toute question relative à vos données personnelles, contactez-nous à l'adresse : <strong>contact@videosave.app</strong></p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons les données suivantes :</p>
      <ul>
        <li><strong>Adresse IP</strong> : enregistrée temporairement à des fins de limitation des requêtes abusives (rate-limiting). Supprimée automatiquement sous 30 jours.</li>
        <li><strong>URLs soumises</strong> : non conservées au-delà du temps de traitement.</li>
        <li><strong>Fichiers convertis</strong> : stockés maximum 30 minutes sur nos serveurs, puis supprimés définitivement et automatiquement.</li>
      </ul>
      <p>Nous ne collectons pas de nom, prénom, email ou aucune autre donnée d'identification sans votre consentement explicite.</p>

      <h2>3. Cookies et technologies similaires</h2>
      <p>VideoSave utilise les types de cookies suivants :</p>
      <ul>
        <li><strong>Cookies fonctionnels</strong> : nécessaires au bon fonctionnement du service (session, sécurité).</li>
        <li><strong>Cookies publicitaires (Google AdSense)</strong> : utilisés pour afficher des publicités personnalisées. Google peut utiliser ces cookies pour vous proposer des annonces en fonction de vos visites sur ce site et d'autres sites.</li>
      </ul>
      <p>Vous pouvez refuser les cookies publicitaires à tout moment via :</p>
      <ul>
        <li><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Les paramètres publicitaires de Google</a></li>
        <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Le portail de désinscription publicitaire</a></li>
        <li>Les paramètres de votre navigateur</li>
      </ul>

      <h2>4. Google AdSense</h2>
      <p>Nous utilisons Google AdSense pour afficher des publicités. Google, en tant que fournisseur tiers, utilise des cookies pour diffuser des annonces sur notre site. L'utilisation par Google du cookie DART lui permet de diffuser des annonces auprès des utilisateurs en fonction de leur visite sur notre site et d'autres sites internet.</p>
      <p>Pour en savoir plus sur Google AdSense et la protection de votre vie privée : <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Politique de confidentialité de Google</a></p>

      <h2>5. Base légale du traitement (RGPD)</h2>
      <p>Le traitement de vos données repose sur :</p>
      <ul>
        <li><strong>L'intérêt légitime</strong> : pour la sécurité et la limitation des abus.</li>
        <li><strong>Le consentement</strong> : pour les cookies publicitaires.</li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
      <ul>
        <li>Droit d'accès à vos données personnelles</li>
        <li>Droit de rectification</li>
        <li>Droit à l'effacement ("droit à l'oubli")</li>
        <li>Droit à la limitation du traitement</li>
        <li>Droit d'opposition</li>
        <li>Droit à la portabilité des données</li>
      </ul>
      <p>Pour exercer vos droits, contactez-nous à : <strong>contact@videosave.app</strong></p>
      <p>Vous pouvez également introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.</p>

      <h2>7. Sécurité</h2>
      <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou destruction.</p>

      <h2>8. Modifications</h2>
      <p>Nous nous réservons le droit de modifier cette politique à tout moment. La date de dernière mise à jour est indiquée en haut de cette page.</p>
    </main>
  );
}

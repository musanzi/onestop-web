import { Component, signal, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, ChevronDown, Mail, Phone, MessageCircle } from 'lucide-angular';
import { FAQItem } from '@shared/models';
import { FaqPageSkeleton } from '../components/faq-page-skeleton/faq-page-skeleton';
import { PublicButton, PublicCard, PublicContainer, PublicPageHero, PublicSection } from '@shared/public';

@Component({
  selector: 'app-faq',
  imports: [
    TranslateModule,
    LucideAngularModule,
    FaqPageSkeleton,
    PublicPageHero,
    PublicSection,
    PublicContainer,
    PublicCard,
    PublicButton
  ],
  templateUrl: './faq-page.html'
})
export class FaqPage {
  icons = { chevronDown: ChevronDown, mail: Mail, phone: Phone, messageCircle: MessageCircle };
  selectedCategory = signal<'all' | 'general' | 'programs' | 'events' | 'entrepreneurs' | 'technical' | 'dashboard'>(
    'all'
  );

  categories: {
    key: 'all' | 'general' | 'programs' | 'events' | 'entrepreneurs' | 'technical' | 'dashboard';
    label: string;
  }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'general', label: 'Général' },
    { key: 'dashboard', label: 'Dashboard & Mentor' },
    { key: 'programs', label: 'Programmes' },
    { key: 'events', label: 'Événements' },
    { key: 'entrepreneurs', label: 'Entrepreneurs' },
    { key: 'technical', label: 'Technique' }
  ];

  loading = signal(true);

  faqItems: FAQItem[] = [
    {
      question: 'Le site cinolu.org est-il gratuit ?',
      answer:
        "Oui, l'accès au site et à ses contenus est totalement gratuit. Certains programmes peuvent avoir des frais de participation, mais cela est clairement indiqué dans leurs descriptions.",
      category: 'general'
    },
    {
      question: 'Dois-je créer un compte pour utiliser le site ?',
      answer:
        'Non, vous pouvez naviguer et consulter tous les contenus sans créer de compte. Un compte sera nécessaire uniquement si vous postulez à certains programmes ou événements.',
      category: 'general'
    },
    {
      question: 'Le site est-il disponible en plusieurs langues ?',
      answer:
        'Oui, le site est disponible en Français et en Anglais. Vous pouvez changer de langue à tout moment via le sélecteur en haut à droite.',
      category: 'general'
    },
    {
      question: 'Comment puis-je être informé des nouveautés ?',
      answer:
        'Suivez Cinolu sur les réseaux sociaux (Facebook, LinkedIn, Instagram, Twitter) pour rester informé des dernières actualités.',
      category: 'general'
    },

    {
      question: 'Comment puis-je postuler à un programme ?',
      answer:
        'Consultez la page "Programmes", sélectionnez celui qui vous intéresse, lisez les critères d\'éligibilité et cliquez sur "Postuler" ou contactez Cinolu via le formulaire de contact.',
      category: 'programs'
    },
    {
      question: 'Les programmes sont-ils réservés aux habitants de Lubumbashi ?',
      answer:
        "La plupart des programmes sont ouverts aux entrepreneurs de toute la RDC et parfois d'autres pays africains. Consultez les critères d'éligibilité de chaque programme.",
      category: 'programs'
    },
    {
      question: "Combien de temps dure l'accompagnement ?",
      answer:
        'La durée varie selon le type de programme : de quelques jours (formations intensives) à plusieurs mois (incubation/accélération). Les détails sont précisés dans chaque programme.',
      category: 'programs'
    },
    {
      question: 'Cinolu finance-t-il les projets ?',
      answer:
        'Cinolu accompagne principalement par le renforcement de capacités, le mentorat et la mise en réseau. Certains programmes peuvent inclure des subventions ou connecter les entrepreneurs à des investisseurs. Consultez les détails de chaque programme.',
      category: 'programs'
    },

    {
      question: "Comment m'inscrire à un événement ?",
      answer:
        'Allez sur la page "Événements", cliquez sur l\'événement qui vous intéresse, puis cliquez sur "Postuler Maintenant" et remplissez le formulaire.',
      category: 'events'
    },
    {
      question: 'Les événements sont-ils payants ?',
      answer:
        "La plupart des événements organisés par Cinolu sont gratuits. Si des frais sont requis, cela sera clairement indiqué dans la description de l'événement.",
      category: 'events'
    },
    {
      question: 'Puis-je participer en ligne ou les événements sont-ils uniquement en présentiel ?',
      answer:
        "Cela dépend de l'événement. Les détails (présentiel, en ligne ou hybride) sont précisés dans chaque description d'événement.",
      category: 'events'
    },
    {
      question: 'Comment puis-je ajouter un événement à mon calendrier Google ?',
      answer:
        'Sur la page de l\'événement, cliquez sur "Ajouter au calendrier", puis sélectionnez "Google Calendar". L\'événement sera ajouté automatiquement.',
      category: 'events'
    },

    {
      question: 'Comment puis-je figurer dans la section "Nos entrepreneurs" ?',
      answer:
        "Vous devez être accompagné par Cinolu dans le cadre d'un de ses programmes. Contactez Cinolu pour discuter des opportunités d'accompagnement.",
      category: 'entrepreneurs'
    },
    {
      question: 'Puis-je contacter directement les entrepreneurs affichés ?',
      answer:
        'Certains profils affichent un site web ou des coordonnées. Sinon, vous pouvez contacter Cinolu qui facilitera la mise en relation si appropriée.',
      category: 'entrepreneurs'
    },

    {
      question: 'Le site est-il accessible sur mobile ?',
      answer:
        "Oui, le site cinolu.org est entièrement responsive et s'adapte à tous les appareils (smartphone, tablette, ordinateur).",
      category: 'technical'
    },
    {
      question: "J'ai oublié mon mot de passe, que faire ?",
      answer:
        'Si vous avez créé un compte, utilisez la fonctionnalité "Mot de passe oublié" sur la page de connexion. Un lien de réinitialisation vous sera envoyé par email.',
      category: 'technical'
    },
    {
      question: "Le site ne s'affiche pas correctement, que faire ?",
      answer:
        'Essayez de rafraîchir la page (Ctrl+F5), videz le cache de votre navigateur, ou utilisez un autre navigateur (Chrome, Firefox, Safari). Si le problème persiste, contactez le support.',
      category: 'technical'
    },
    {
      question: 'Puis-je télécharger des ressources depuis le site ?',
      answer:
        'Certains articles du blog peuvent inclure des ressources téléchargeables. Recherchez les liens de téléchargement dans les contenus.',
      category: 'technical'
    },

    // Dashboard & Mentor
    {
      question: 'Comment accéder au tableau de bord (Dashboard) ?',
      answer:
        "Connectez-vous à votre compte Cinolu, puis cliquez sur « Tableau de bord » ou « Mon espace » dans le menu. Vous accéderez à votre Dashboard : vue d'ensemble, Mes Projets, programmes, parrainage et compte.",
      category: 'dashboard'
    },
    {
      question: 'À quoi sert la page « Accueil » du Dashboard ?',
      answer:
        "La page Accueil (Vue d'ensemble) vous donne un résumé de votre activité : vos projets, vos candidatures aux programmes, et des raccourcis vers les sections principales du tableau de bord.",
      category: 'dashboard'
    },
    {
      question: 'Comment gérer mes projets et mes produits ?',
      answer:
        'Allez dans « Mes Projets » dans le menu du Dashboard. Vous pouvez créer un ou plusieurs projets, les modifier, et gérer les produits associés. Un projet est nécessaire pour postuler à un programme.',
      category: 'dashboard'
    },
    {
      question: 'Où découvrir et postuler aux programmes ?',
      answer:
        'Dans le Dashboard, section « Programmes » > « Découvrir ». Vous y voyez les programmes en cours et à venir. Cliquez sur un programme pour voir le détail, puis sur « Postuler » en choisissant le projet avec lequel candidater. Les candidatures en attente sont dans « Mes candidatures ».',
      category: 'dashboard'
    },
    {
      question: 'Que sont les « Programmes acceptés » et la « Roadmap » ?',
      answer:
        'Une fois votre candidature acceptée, le programme apparaît dans « Programmes acceptés ». Vous y voyez votre progression (phases complétées) et des statistiques. La « Roadmap » d’un programme affiche la liste des phases : dates, statut (en cours, terminé, à venir) et, pour les phases actives, le dépôt de livrables (PDF).',
      category: 'dashboard'
    },
    {
      question: 'Comment déposer un livrable pour une phase de programme ?',
      answer:
        'Sur la page détail du programme (si vous êtes inscrit) ou sur la Roadmap du programme, ouvrez la phase concernée. Si la phase accepte des livrables et que la date limite n’est pas dépassée, choisissez un fichier PDF (max 10 Mo) et cliquez sur « Envoyer ». Vous pouvez soumettre plusieurs versions ; la dernière est prise en compte.',
      category: 'dashboard'
    },
    {
      question: 'Où modifier mon profil et ma sécurité ?',
      answer:
        'Dans le Dashboard, section « Mon Compte » > « Mon Profil » : « Informations » pour vos données personnelles, « Sécurité » pour changer votre mot de passe et les options de sécurité.',
      category: 'dashboard'
    },
    {
      question: 'Comment devenir mentor sur Cinolu ?',
      answer:
        'Dans le Dashboard, allez dans « Mon Compte » > « Mon Profil » > « Mentorat ». Vous pouvez y postuler pour devenir mentor : renseignez votre expérience, vos expertises et votre parcours. Une fois votre candidature validée, le rôle « mentor » vous sera attribué et l’« Espace Mentor » apparaîtra dans le menu.',
      category: 'dashboard'
    },
    {
      question: 'Qu’est-ce que l’Espace Mentor et qui y a accès ?',
      answer:
        'L’Espace Mentor est réservé aux utilisateurs ayant le rôle « mentor » (candidature mentor validée par Cinolu). Il contient le « Dashboard Mentor » (vue d’ensemble de votre activité mentor) et « Mon Profil Mentor » pour gérer votre profil public de mentor (CV, expertises, expériences).',
      category: 'dashboard'
    },
    {
      question: 'À quoi sert le Dashboard Mentor ?',
      answer:
        'Le Dashboard Mentor vous permet de suivre vos sessions de mentorat, les demandes en attente, vos mentorés actifs et votre activité récente. Vous y gérez vos rendez-vous et le suivi des entrepreneurs que vous accompagnez.',
      category: 'dashboard'
    },
    {
      question: 'Où gérer mon profil mentor (CV, expertises) ?',
      answer:
        'Dans le Dashboard, section « Mentorat » > « Mon Profil Mentor ». Vous pouvez mettre à jour vos années d’expérience, votre CV, vos expertises et vos expériences professionnelles. Ces informations sont visibles par les entrepreneurs qui recherchent un mentor.',
      category: 'dashboard'
    },
    {
      question: 'Comment fonctionne le parrainage dans le Dashboard ?',
      answer:
        'Sous « Communauté » > « Parrainage », vous trouvez votre lien de parrainage à partager, la liste de vos filleuls, vos badges et votre progression, ainsi que l’historique de votre activité de parrainage.',
      category: 'dashboard'
    }
  ];

  filteredFAQ = computed(() => {
    const category = this.selectedCategory();
    if (category === 'all') {
      return this.faqItems;
    }
    return this.faqItems.filter((item) => item.category === category);
  });

  toggleFAQ(item: FAQItem) {
    item.open = !item.open;
  }

  constructor() {
    setTimeout(() => this.loading.set(false), 350);
  }
}

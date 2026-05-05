import { useState, useEffect } from 'react';
import { homeService } from '@/lib/api';

interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
  };
  about: {
    title: string;
    description: string;
    image: string;
    highlights: string[];
  };
  services: Array<{
    title: string;
    description: string;
    icon: string;
    image: string;
  }>;
  process: Array<{
    step: number;
    title: string;
    description: string;
    image: string;
  }>;
  testimonials: Array<{
    name: string;
    company: string;
    text: string;
    rating: number;
    image: string;
  }>;
  contact: {
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    workingHours: string;
  };
}

export function useHomeContent() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await homeService.getContent();
        
        if (response.success && response.data) {
          setContent(response.data as HomeContent);
        } else {
          throw new Error('Erreur lors du chargement du contenu');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du contenu de la page d\'accueil:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Fallback vers du contenu par défaut en cas d'erreur
        setContent({
          hero: {
            title: "L'élégance du bois, l'empreinte de l'art",
            subtitle: "Découvrez l'excellence de l'ébénisterie tunisienne avec ÉBÉNOR CRÉATION. Nous transformons vos espaces en œuvres d'art avec passion et savoir-faire depuis plus de 25 ans.",
            backgroundImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
            ctaText: "Demander un devis",
            ctaLink: "/contact"
          },
          about: {
            title: "Notre Expertise",
            description: "ÉBÉNOR CRÉATION est une entreprise familiale tunisienne spécialisée dans la fabrication de meubles haut de gamme. Nous combinons techniques traditionnelles et technologies modernes pour créer des pièces uniques qui reflètent votre personnalité et s'adaptent parfaitement à vos espaces.",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            highlights: [
              "Plus de 25 ans d'expérience",
              "Artisans qualifiés et passionnés",
              "Matériaux nobles sélectionnés",
              "Fabrication 100% tunisienne",
              "Service personnalisé"
            ]
          },
          services: [
            {
              title: "Cuisines sur Mesure",
              description: "Créez la cuisine de vos rêves avec nos designs personnalisés, alliant fonctionnalité et esthétique pour un espace de vie exceptionnel.",
              icon: "kitchen",
              image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
              title: "Dressings Élégants",
              description: "Optimisez votre espace avec nos dressings sur mesure, conçus pour allier rangement intelligent et design raffiné.",
              icon: "wardrobe",
              image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
              title: "Mobilier de Luxe",
              description: "Découvrez notre collection de meubles haut de gamme, chaque pièce étant une œuvre d'art fonctionnelle pour votre intérieur.",
              icon: "furniture",
              image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
              title: "Aménagements Complets",
              description: "Transformez entièrement vos espaces avec nos solutions d'aménagement global, de la conception à la réalisation.",
              icon: "home",
              image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
          ],
          process: [
            {
              step: 1,
              title: "Consultation",
              description: "Rencontre personnalisée pour comprendre vos besoins, vos goûts et votre budget. Nous étudions votre espace et vos contraintes.",
              image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
              step: 2,
              title: "Design 3D",
              description: "Création de plans détaillés et visualisation 3D de votre projet pour vous permettre de voir le résultat avant fabrication.",
              image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
              step: 3,
              title: "Fabrication",
              description: "Réalisation artisanale dans nos ateliers avec des matériaux nobles et un contrôle qualité rigoureux à chaque étape.",
              image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
              step: 4,
              title: "Installation",
              description: "Pose professionnelle par nos équipes expertes avec finitions parfaites et nettoyage complet de votre espace.",
              image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
          ],
          testimonials: [
            {
              name: "Ahmed Ben Salem",
              company: "Villa Sidi Bou Saïd",
              text: "Un travail exceptionnel ! L'équipe d'ÉBÉNOR CRÉATION a transformé notre cuisine en véritable œuvre d'art. La qualité des matériaux et la finition sont irréprochables.",
              rating: 5,
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            },
            {
              name: "Leila Trabelsi",
              company: "Appartement La Marsa",
              text: "Service personnalisé remarquable. Ils ont su comprendre exactement ce que nous voulions et ont livré au-delà de nos attentes. Je recommande vivement !",
              rating: 5,
              image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            },
            {
              name: "Mohamed Gharbi",
              company: "Bureau Tunis Centre",
              text: "Professionnalisme et créativité au rendez-vous. Notre espace de bureau a été complètement transformé avec des solutions innovantes et élégantes.",
              rating: 5,
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            }
          ],
          contact: {
            address: "Zone Industrielle Mghira 2, 2082 Fouchana, Tunis, Tunisie",
            phone: "+216 70 123 456",
            email: "contact@ebenor-creation.tn",
            whatsapp: "+216 98 765 432",
            workingHours: "Lundi - Vendredi: 8h00 - 17h00 | Samedi: 8h00 - 12h00"
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading, error, refetch: () => window.location.reload() };
}
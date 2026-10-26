import { ChefHat } from 'lucide-react';
import ComingSoon from '@/components/ComingSoon';

export default function RecipesPage() {
  return (
    <ComingSoon
      title="Recipes"
      subtitle="Meal ideas made with what we stock"
      icon={ChefHat}
      description="Simple, affordable recipes using ingredients you can buy from Chipiku Plus, including local favourites."
      features={[
        'Step-by-step recipes with preparation and cooking times',
        'One tap to add every ingredient to your cart',
        'Seasonal and everyday family meal ideas',
        'Save your favourite recipes',
      ]}
    />
  );
}
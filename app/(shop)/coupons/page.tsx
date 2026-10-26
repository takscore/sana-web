import { Ticket } from 'lucide-react';
import ComingSoon from '@/components/ComingSoon';

export default function CouponsPage() {
  return (
    <ComingSoon
      title="Coupons"
      subtitle="Save more on every shop"
      icon={Ticket}
      description="Digital coupons are on the way. Clip them here and apply them at checkout. No paper needed."
      features={[
        'Digital coupons you can save to your account',
        'Promo codes applied at checkout (the field is already there)',
        'Welcome offers for new customers and branch-specific deals',
        'Reminders before your coupons expire',
      ]}
    />
  );
}
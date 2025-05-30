
'use client';

import { Calculator, Target, Lightbulb, Brain } from 'lucide-react';

const features = [
  { text: 'Profitability Calculator', icon: Calculator },
  { text: 'AI Ad Budget Analysis', icon: Brain },
  { text: 'AI Marketing Content', icon: Lightbulb },
  { text: 'Ad Image Generation', icon: Lightbulb },
];

const FeatureItem = ({ feature }: { feature: typeof features[0] }) => (
  <span className="mx-4 flex items-center text-xs uppercase font-bold flex-shrink-0"> {/* Added font-bold */}
    <feature.icon className="mr-2 h-4 w-4" /> {/* Changed icon size from h-3 w-3 to h-4 w-4 */}
    {feature.text}
  </span>
);

export function MarqueeBanner() {
  return (
    <div className="bg-primary text-primary-foreground overflow-hidden whitespace-nowrap h-10 flex items-center">
      <div className="animate-marquee flex"> {/* animate-marquee will now be on the direct child that contains the duplicated content */}
        {/* Render the set of features once */}
        <div className="flex animate-marquee-content flex-shrink-0">
          {features.map((feature, index) => (
            <FeatureItem key={`set1-${index}`} feature={feature} />
          ))}
        </div>
        {/* Render the set of features a second time for seamless looping */}
        <div className="flex animate-marquee-content flex-shrink-0" aria-hidden="true">
          {features.map((feature, index) => (
            <FeatureItem key={`set2-${index}`} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  );
}


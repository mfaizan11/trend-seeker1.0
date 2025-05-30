import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string; // Description prop is kept for type safety but will not be rendered
  icon?: LucideIcon;
}

export function PageHeader({ title, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {/* This div centers the icon and title block */}
      <div className="flex items-center justify-center gap-3 w-full">
        {Icon && <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />}
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>
      {/* Description paragraph has been removed */}
    </div>
  );
}

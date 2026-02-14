import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  const image = PlaceHolderImages.find(p => p.id === 'empty-state-illustration');

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full rounded-lg bg-muted/30">
      {image && (
          <Image
            src={image.imageUrl}
            alt={image.description}
            width={120}
            height={120}
            className="opacity-50 mb-4"
            data-ai-hint={image.imageHint}
          />
      )}
      <h3 className="text-lg font-semibold text-foreground/80">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
    </div>
  );
}

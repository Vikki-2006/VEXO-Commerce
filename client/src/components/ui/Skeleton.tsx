import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-warm/80 border border-sand/40 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-sand/40 before:to-transparent',
        className
      )}
    />
  );
};

export const HeroSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8 items-center">
    <div className="flex-1 space-y-4 w-full">
      <Skeleton className="h-6 w-32 rounded-full" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-12 w-36 rounded-xl" />
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>
    </div>
    <div className="flex-1 w-full aspect-square max-w-md">
      <Skeleton className="w-full h-full rounded-2xl" />
    </div>
  </div>
);

export const ProductCardSkeleton: React.FC = () => (
  <div className="rounded-xl p-4 border border-sand/60 bg-card/60 flex flex-col gap-4">
    <Skeleton className="aspect-square w-full rounded-lg" />
    <div className="space-y-2">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-10" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-sand/40">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  </div>
);

export const CategoriesSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-7xl mx-auto px-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="p-6 rounded-xl border border-sand/60 bg-card/60 flex flex-col items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    ))}
  </div>
);

export const ReviewsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-5 rounded-xl border border-sand/60 bg-card/60 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    ))}
  </div>
);

export const ProductPageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
    <div className="space-y-4">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
    <div className="space-y-6">
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="h-8 w-4/5" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 flex-1 rounded-xl" />
      </div>
    </div>
  </div>
);

export const CartSkeleton: React.FC = () => (
  <div className="p-4 space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-4 items-center">
        <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    ))}
  </div>
);

export const SearchResultsSkeleton: React.FC = () => (
  <div className="space-y-3 py-2">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-sand/40">
        <Skeleton className="w-10 h-10 rounded-md shrink-0" />
        <div className="flex-1 space-y-1">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

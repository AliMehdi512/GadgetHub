import { Link } from "wouter";

interface CategoryBlockProps {
  name: string;
  slug: string;
  imageUrl: string;
}

export function CategoryBlock({ name, slug, imageUrl }: CategoryBlockProps) {
  return (
    <Link href={`/category/${slug}`}>
      <a className="group block relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-md" data-testid={`category-block-${slug}`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h3
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold uppercase text-white tracking-tight"
            data-testid={`text-category-${slug}`}
          >
            {name}
          </h3>
        </div>
      </a>
    </Link>
  );
}

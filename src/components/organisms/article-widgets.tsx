import { Card, CardContent, CardHeader, CardTitle } from '../atoms/card';
import { Badge } from '../atoms/badge';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceholderImage } from '@/assets/images';
import { Article } from '@/generated/prisma';

interface ArticleCardProps {
  data: Pick<Article, 'slug' | 'title' | 'picturePath' | 'tags'>;
}

const ArticleCard = ({ data }: ArticleCardProps) => {
  return (
    <Card className="hover:shadow-primary transition-all hover:scale-105 hover:shadow-lg">
      <CardHeader>
        <Image
          src={data.picturePath ? data.picturePath : PlaceholderImage}
          alt=""
          width={500}
          height={500}
          className="bg-secondary mb-3 aspect-video overflow-hidden rounded-md"
        />
        <CardTitle>
          <Link href={`/artikel/${data.slug}`} className="hover:underline">
            {data.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {data.tags
          ?.split(',')
          .filter(Boolean)
          .map((tag, i) => <Badge key={i}>{tag}</Badge>)}
      </CardContent>
    </Card>
  );
};

export { ArticleCard };

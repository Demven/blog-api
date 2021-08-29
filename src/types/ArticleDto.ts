import ImageDto from './ImageDto';
import CategoryDto from './CategoryDto';
import KeywordDto from './KeywordDto';
import ViewsCountDto from './ViewsCountDto';

export default interface ArticleDto {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  image: ImageDto;
  category: CategoryDto;
  keywords: KeywordDto[];
  views: ViewsCountDto;
  publication_date: string;
  last_updated: string;
  deleted: boolean;
  body: any[];
}

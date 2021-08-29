export const articlesDefinitions = `
  type Article {
    _id: String
    title: String
    description: String
    slug: String
    image: Image
    category: Category
    keywords: [Keyword]
    views: ViewsCount
    publication_date: DateTime
    last_updated: DateTime
    deleted: Boolean
    body: JSON
  }

  input ImageDto {
    _id: String
    url: String
    description: String
    credits: String
  }

  input CategoryDto {
    _id: String
    title: String
    slug: String
    color: String
  }

  input KeywordDto {
    _id: String
    name: String
    slug: String
  }

  input ViewsCountDto {
    count: Int
  }

  input ArticleDto {
    _id: String
    title: String!
    description: String
    slug: String
    image: ImageDto
    category: CategoryDto
    keywords: [KeywordDto]
    views: ViewsCountDto
    publication_date: DateTime
    last_updated: DateTime
    deleted: Boolean
    body: JSON
  }
`;

export const articlesQuery = `
  article (slug:String!, ignorePageView:Boolean): Article
  popularArticles (limit:Int): [Article]
  sitemapArticles: [Article]
`;

export const articlesMutations = `
  createArticle (article:ArticleDto): Article
  updateArticle (article:ArticleDto): Article
`;

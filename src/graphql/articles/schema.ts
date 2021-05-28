export const articlesDefinitions = `
  type Article {
    title: String
    description: String
    slug: String
    image: Image
    category: Category
    keywords: [Keyword]
    views: Int
    publication_date: DateTime
    last_updated: DateTime
    deleted: Boolean
    body: JSON
  }
`;

export const articlesQuery = `
  article (slug:String!, ignorePageView:Boolean): Article
  popularArticles: [Article]
`;

export const articlesMutations = ``;

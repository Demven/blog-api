export const categoriesDefinitions = `
  type Category {
    _id: String
    title: String
    slug: String
    color: String
  }
`;

export const categoriesQuery = `
  categories: [Category]
  categoryArticles (categorySlug:String!, articleTitleSearch:String, limit:Int): [Article]
  mostPopularInCategory (categorySlug:String!, excludeSlug:String!, limit:Int): [Article]
`;

export const categoriesMutations = ``;

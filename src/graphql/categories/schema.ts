export const categoriesDefinitions = `
  type Category {
    title: String
    slug: String
    color: String
  }
`;

export const categoriesQuery = `
  categories: [Category]
  categoryArticles (categorySlug:String!, articleTitleSearch:String, limit:Int): [Article]
`;

export const categoriesMutations = ``;

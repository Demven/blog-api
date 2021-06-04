export const keywordsDefinitions = `
  type Keyword {
    name: String
    slug: String
  }
`;

export const keywordsQuery = `
  keywords (search:String, limit:Int): [Keyword]
  keywordArticles (keywordSlug:String!, articleTitleSearch:String, limit:Int): [Article]
`;

export const keywordsMutations = `
  createKeyword (name:String): Keyword
`;

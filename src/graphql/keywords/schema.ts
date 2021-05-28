export const keywordsDefinitions = `
  type Keyword {
    name: String
    slug: String
  }
`;

export const keywordsQuery = `
  keywords (search:String, limit:Int): [Keyword]
`;

export const keywordsMutations = ``;

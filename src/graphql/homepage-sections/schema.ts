export const homepageSectionsDefinitions = `
  type HomepageSection {
    _id: String
    category: Category
    articles: [Article]
    order: Int
  }
`;

export const homepageSectionsQuery = `
  homepageSections: [HomepageSection]
`;

export const homepageSectionsMutations = `
  updateHomepageSection (id:String!, articleIds:[String]): HomepageSection
`;

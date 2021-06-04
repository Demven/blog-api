export const homepageSectionsDefinitions = `
  type HomepageSection {
    category: Category
    articles: [Article]
    order: Int
  }
`;

export const homepageSectionsQuery = `
  homepageSections: [HomepageSection]
`;

export const homepageSectionsMutations = `
  updateHomepageSection (id:Int!, articleIds:[Int]): HomepageSection
`;

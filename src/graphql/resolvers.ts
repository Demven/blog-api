import keywordsResolvers from './keywords/resolvers';
import categoriesResolvers from './categories/resolvers';
import homepageSectionsResolvers from './homepage-sections/resolvers';
import articlesResolvers from './articles/resolvers';

const resolvers = {
  ...keywordsResolvers,
  ...categoriesResolvers,
  ...homepageSectionsResolvers,
  ...articlesResolvers,
};

export default resolvers;

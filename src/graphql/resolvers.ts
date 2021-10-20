import keywordsResolvers from './keywords/resolvers';
import categoriesResolvers from './categories/resolvers';
import homepageSectionsResolvers from './homepage-sections/resolvers';
import articlesResolvers from './articles/resolvers';
import thanksCountResolvers from './thanks-count/resolvers';

const resolvers = {
  ...keywordsResolvers,
  ...categoriesResolvers,
  ...homepageSectionsResolvers,
  ...articlesResolvers,
  ...thanksCountResolvers,
};

export default resolvers;

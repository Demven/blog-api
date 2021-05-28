import { buildSchema } from 'graphql';
import { imagesDefinitions, imagesQuery, imagesMutations } from './images/schema';
import { keywordsDefinitions, keywordsQuery, keywordsMutations } from './keywords/schema';
import { categoriesDefinitions, categoriesQuery, categoriesMutations } from './categories/schema';
import { articlesDefinitions, articlesQuery, articlesMutations } from './articles/schema';
import { homepageSectionsDefinitions, homepageSectionsQuery, homepageSectionsMutations } from './homepage-sections/schema';

const schema = `
  scalar JSON
  scalar DateTime

  ${imagesDefinitions}
  ${keywordsDefinitions}
  ${categoriesDefinitions}
  ${articlesDefinitions}
  ${homepageSectionsDefinitions}

  type Query {
    ${imagesQuery}
    ${keywordsQuery}
    ${categoriesQuery}
    ${articlesQuery}
    ${homepageSectionsQuery}
  }
`;

console.info('schema', schema);

export default buildSchema(schema);

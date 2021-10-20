import { buildSchema } from 'graphql';
import { imagesDefinitions, imagesQuery, imagesMutations } from './images/schema';
import { viewsCountDefinitions, viewsCountQuery, viewsCountMutations } from './views-count/schema';
import { thanksCountDefinitions, thanksCountQuery, thanksCountMutations } from './thanks-count/schema';
import { keywordsDefinitions, keywordsQuery, keywordsMutations } from './keywords/schema';
import { categoriesDefinitions, categoriesQuery, categoriesMutations } from './categories/schema';
import { articlesDefinitions, articlesQuery, articlesMutations } from './articles/schema';
import { homepageSectionsDefinitions, homepageSectionsQuery, homepageSectionsMutations } from './homepage-sections/schema';

const schema = `
  scalar JSON
  scalar DateTime

  ${imagesDefinitions}
  ${viewsCountDefinitions}
  ${thanksCountDefinitions}
  ${keywordsDefinitions}
  ${categoriesDefinitions}
  ${articlesDefinitions}
  ${homepageSectionsDefinitions}

  type Query {
    ${imagesQuery}
    ${viewsCountQuery}
    ${thanksCountQuery}
    ${keywordsQuery}
    ${categoriesQuery}
    ${articlesQuery}
    ${homepageSectionsQuery}
  }

  type Mutation {
    ${imagesMutations}
    ${viewsCountMutations}
    ${thanksCountMutations}
    ${keywordsMutations}
    ${categoriesMutations}
    ${articlesMutations}
    ${homepageSectionsMutations}
  }
`;

console.info('schema', schema);

export default buildSchema(schema);

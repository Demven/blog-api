import Category from '../../dal/models/category';

const categoriesResolvers = {
  categories: () => {
    return Category.find();
  },
};

export default categoriesResolvers;

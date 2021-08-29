import HomepageSection from '../../dal/models/homepage-section';
import Article from '../../dal/models/article';

const homepageSectionsResolvers = {
  homepageSections: () => {
    return HomepageSection
      .find()
      .sort({ order: 'asc' })
      .populate('category')
      .populate({
        path: 'articles',
        populate: { path: 'image category views' },
        select: '-body',
      })
      .exec();
  },

  updateHomepageSection: async (
    { id, articleIds = [] }: { id:string, articleIds:string[] }
  ) => {
    const articles = await Promise.all(articleIds.map((id:string) => Article.findById(id)));

    return HomepageSection.findByIdAndUpdate(id, { $set: { articles } });
  },
};

export default homepageSectionsResolvers;

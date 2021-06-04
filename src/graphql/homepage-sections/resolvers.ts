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
    { id, articleIds = [] }: { id: number, articleIds: number[] }
  ) => {
    const articles = await Promise.all(articleIds.map((id:number) => Article.findById(id)));

    return HomepageSection.findByIdAndUpdate(id, { $set: { articles: articles } });
  },
};

export default homepageSectionsResolvers;

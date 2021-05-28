import HomepageSection from '../../dal/models/homepage-section';

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
};

export default homepageSectionsResolvers;

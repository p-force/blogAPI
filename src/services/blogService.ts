/* eslint-disable @typescript-eslint/no-var-requires */
const { Refresh, BlogPost, User } = require('../db/models');

class BlogService {
  async createPost(content: string, refreshToken: string): Promise<void> {
    try {
      const { userId } = (await Refresh.findOne({ where: { refreshToken } })).dataValues;
      const post = await BlogPost.create({ content, userId });
      if (!post) { throw new Error('Post not created'); }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }

  async updatePost(content: string, postId: string, refreshToken: string): Promise<void> {
    try {
      const { userId } = (await Refresh.findOne({ where: { refreshToken } })).dataValues;
      const post = await BlogPost.findOne({ where: { id: postId } });
      if (post.dataValues.userId !== userId) { throw new Error('You do not have permission to update the post'); }
      const postUpdated = await BlogPost.update({ content }, { where: { id: postId } });
      if (!postUpdated) { throw new Error('Post not updated'); }
    } catch (err) {
      if (err instanceof Error) { // экземпляр класса
        throw new Error(err.message);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }

  async deletePost(postID: string, refreshToken: string): Promise<void> {
    try {
      const { userId } = (await Refresh.findOne({ where: { refreshToken } })).dataValues;
      const post = await BlogPost.findOne({ where: { id: postID } });
      if (post.dataValues.userId !== userId) { throw new Error('You do not have permission to deleted the post'); }
      const postDeleted = await BlogPost.destroy({ where: { id: postID } });
      if (!postDeleted) { throw new Error('Post not deleted'); }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }

  async getPosts(pageNum: string): Promise<Array<typeof BlogPost>> {
    try {
      const pageNumber = Number(pageNum); // Номер страницы
      const pageSize = 20; // Размер страницы (количество записей на странице)
      const offset = (pageNumber - 1) * pageSize; // Количество записей, которые следует пропустить
      const limit = pageSize; // Количество записей, которые следует взять
      const fullPosts = await BlogPost.findAll({
        offset,
        limit,
        attributes: ['content', 'createdAt'],
        include: [{
          model: User, attributes: ['fullName'],
        }],
      });
      const posts = fullPosts
        .map((el: any) => el.get({ plain: true }))
        .map((el1: any) => ({
          content: el1.content,
          fullName: el1.User.fullName,
          createdAt: el1.createdAt,
        }));
      if (!posts.length) { throw new Error('No posts found'); }
      return posts;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }
}

export default new BlogService();

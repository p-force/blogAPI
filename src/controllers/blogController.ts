import { Request, Response } from 'express';
import blogService from '../services/blogService';

class AuthController {
  async createPost(req: Request, res: Response): Promise<Response> {
    try {
      const { content } = req.body;
      const { refreshToken } = req.cookies;
      await blogService.createPost(content, refreshToken);
      return res.status(200).json({ message: 'Post added successfully' });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Failed to create post' });
    }
  }

  async updatePost(req: Request, res: Response): Promise<Response> {
    try {
      const { content } = req.body;
      const { postId } = req.params;
      const { refreshToken } = req.cookies;
      await blogService.updatePost(content, postId, refreshToken);
      return res.status(200).json({ message: 'Post updated successfully' });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Failed to update post' });
    }
  }

  async deletePost(req: Request, res: Response): Promise<Response> {
    try {
      const { postID } = req.params;
      const { refreshToken } = req.cookies;
      await blogService.deletePost(postID, refreshToken);
      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Failed to delete post' });
    }
  }

  async getPosts(req: Request, res: Response): Promise<Response> {
    try {
      const { pageNum } = req.params;
      const posts = await blogService.getPosts(pageNum);
      return res.status(200).json({ posts });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Failed to get posts' });
    }
  }

  async errorPage(req: Request, res: Response): Promise<Response> {
    return res.status(404).json({ message: 'Page not found' });
  }
}

export default new AuthController();

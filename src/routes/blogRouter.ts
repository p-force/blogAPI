import express from 'express';
import blogController from '../controllers/blogController';

const router = express.Router();

router.post('/newPost', blogController.createPost);
router.put('/:postId', blogController.updatePost);
router.delete('/:postID', blogController.deletePost);
router.get('/page/:pageNum', blogController.getPosts);
router.route('*')
  .get(blogController.errorPage)
  .post(blogController.errorPage)
  .put(blogController.errorPage)
  .delete(blogController.errorPage);
export default router;

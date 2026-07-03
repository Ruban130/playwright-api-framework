import { User, Post, Comment } from '../../src/types/api.types.js';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    email: 'Sincere@april.biz',
    username: 'Bret',
  },
  {
    id: 2,
    name: 'Ervin Howell',
    email: 'Shanna@melissa.tv',
    username: 'Antonette',
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    email: 'Nathan@yesenia.net',
    username: 'Samantha',
  },
];

export const mockPosts: Post[] = [
  {
    userId: 1,
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut et maiores debitis quam qui sed odit et',
  },
  {
    userId: 1,
    id: 2,
    title: 'qui est esse',
    body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea sed\nquia quis excepturi a maiores ut sequi voluptatem qui',
  },
];

export const mockComments: Comment[] = [
  {
    postId: 1,
    id: 1,
    name: 'id labore ex et quam laborum',
    email: 'Eliseo@example.com',
    body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\naliquam et praesentium\nvoluptatem pariatur "nulla sed"',
  },
  {
    postId: 1,
    id: 2,
    name: 'quo vero reiciendis velit similique earum',
    email: 'Jayne_Kuhic@example.com',
    body: 'est natus enim nihil est dolore omnis voluptate numquam\net omnis occaecati quod ullam est voluptates\nsimilique sunt in culpa sint\nCraig modi velit eum doloribus delectus at pariatur aut',
  },
];

export const newPostPayload = {
  title: 'Test Post',
  body: 'This is a test post created by API automation',
  userId: 1,
};

export const updatedPostPayload = {
  id: 1,
  title: 'Updated Post Title',
  body: 'Updated post body with new content',
  userId: 1,
};

export const patchPostPayload = {
  title: 'Patched Post Title',
};

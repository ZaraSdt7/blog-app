import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CommentsService } from '../src/modules/comments/comment.service';
import { PostsService } from '../src/modules/posts/post.service';
import { User } from 'src/modules/users/schema/user.schema';

describe('CommentsService', () => {
  let service: CommentsService;
  let model: any;
  let postsService: PostsService;

  const mockComment = {
    _id: '1',
    content: 'Test Comment',
    post: 'post1',
    author: 'user1',
  };

  const mockUser = {
    _id: 'user1',
    role: 'user',
  };

  const mockPostsService = {
    findOne: jest.fn().mockResolvedValue({ _id: 'post1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PostsService, useValue: mockPostsService },
        {
          provide: getModelToken('Comment'),
          useValue: {
            find: jest.fn(),
            countDocuments: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    model = module.get(getModelToken('Comment'));
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      model.create.mockReturnValue(mockComment);
      const result = await service.create(
        { content: 'Test Comment', postId: 'post1' },
        'user1',
      );
      expect(postsService.findOne).toHaveBeenCalledWith('post1');
      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(postsService, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(
        service.create({ content: 'Test Comment', postId: 'post1' }, 'user1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockComment),
      });
      model.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockComment),
      });

      const result = await service.update('1', { content: 'Updated' }, mockUser as User);
      expect(result).toEqual(mockComment);
    });

    it('should throw UnauthorizedException if not author or admin', async () => {
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockComment, author: 'other' }),
      });

      await expect(
        service.update('1', { content: 'Updated' }, mockUser as unknown as User),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
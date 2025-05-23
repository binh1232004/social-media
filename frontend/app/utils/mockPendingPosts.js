export const mockPendingPosts = [
  {
    id: 'pending1',
    user: {
      id: 'user123',
      name: 'John Doe',
      avatarUrl: '/avatar.png', // Replace with a real or placeholder image path
    },
    content: 'This is a sample pending post awaiting approval. It contains some interesting ideas about our next project.',
    media: [
      { id: 'media1', url: 'https://via.placeholder.com/600x400.png?text=Sample+Image+1', type: 'image' }
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    groupId: 'group1',
  },
  {
    id: 'pending2',
    user: {
      id: 'user456',
      name: 'Jane Smith',
      avatarUrl: '/avatar.png', // Replace with a real or placeholder image path
    },
    content: 'Excited to share this update with the group! Please review and approve. This post has no media.',
    media: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    groupId: 'group1',
  },
  {
    id: 'pending3',
    user: {
      id: 'user789',
      name: 'Alice Brown',
      avatarUrl: '/avatar.png', // Replace with a real or placeholder image path
    },
    content: 'A quick question for the admins - is this type of content okay to post? Check out the attached video.',
    media: [
      { id: 'media2', url: 'https://via.placeholder.com/600x400.png?text=Sample+Video+Placeholder', type: 'video' }
    ],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    groupId: 'group2',
  },
  {
    id: 'pending4',
    user: {
      id: 'user101',
      name: 'Bob Green',
      avatarUrl: '/avatar.png', // Replace with a real or placeholder image path
    },
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. This is a longer post to test text wrapping and display.',
    media: [
      { id: 'media3', url: 'https://via.placeholder.com/300x200.png?text=Image+A', type: 'image' },
      { id: 'media4', url: 'https://via.placeholder.com/300x200.png?text=Image+B', type: 'image' }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    groupId: 'group1',
  },
];

export const getMockPendingPostsByGroupId = (groupId) => {
  return mockPendingPosts.filter(post => post.groupId === groupId);
};

export type ProviderProfile = {
  name: string;
  host: string; // RAPIDAPI_HOST
  paths: {
    userByUsername: (u: string) => string;
    userPosts: (id: string, cursor?: string) => string;
    mediaComments: (id: string, cursor?: string) => string;
    searchHashtag: (tag: string, cursor?: string) => string;
  };
};

export const PROVIDERS: Record<string, ProviderProfile> = {
  // Example: instagram188 (widely used on RapidAPI; verify docs)
  instagram188: {
    name: 'instagram188',
    host: process.env.RAPIDAPI_HOST || 'instagram188.p.rapidapi.com',
    paths: {
      userByUsername: (u) => `/user/info?username=${encodeURIComponent(u)}`,
      userPosts: (id, cursor) => `/user/posts?userid=${id}${cursor ? `&end_cursor=${cursor}` : ''}`,
      mediaComments: (id, cursor) => `/media/comments?media_id=${id}${cursor ? `&end_cursor=${cursor}` : ''}`,
      searchHashtag: (tag, cursor) => `/hashtag/medias?hashtag=${encodeURIComponent(tag)}${cursor ? `&end_cursor=${cursor}` : ''}`,
    },
  },

  // Skeleton for another provider; fill with its docs.
  generic: {
    name: 'generic',
    host: process.env.RAPIDAPI_HOST || 'your-provider.p.rapidapi.com',
    paths: {
      userByUsername: (u) => `/v1/user?username=${encodeURIComponent(u)}`,
      userPosts: (id, cursor) => `/v1/user/${id}/posts${cursor ? `?cursor=${cursor}` : ''}`,
      mediaComments: (id, cursor) => `/v1/media/${id}/comments${cursor ? `?cursor=${cursor}` : ''}`,
      searchHashtag: (tag, cursor) => `/v1/hashtag/${encodeURIComponent(tag)}/posts${cursor ? `?cursor=${cursor}` : ''}`,
    },
  },
};

export function pickProvider(key = process.env.PROVIDER_PROFILE || 'instagram188'): ProviderProfile {
  return PROVIDERS[key];
}

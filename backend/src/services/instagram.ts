import { rq } from '../providers/rapidapi';
import { pickProvider } from '../config/provider';

const P = pickProvider();

export async function getUserByUsername(username: string) {
  return rq(P.paths.userByUsername(username));
}

export async function *iterateUserPosts(userId: string, limit = 300) {
  let cursor: string | undefined;
  let fetched = 0;
  while (fetched < limit) {
    const res: any = await rq(P.paths.userPosts(userId, cursor));
    const items = res?.items || res?.data || res?.result || [];
    for (const it of items) { yield it; fetched++; if (fetched >= limit) return; }
    cursor = res?.next_cursor || res?.end_cursor || res?.paging?.cursors?.after;
    if (!cursor) break;
  }
}

export async function *iterateMediaComments(mediaId: string, limit = 500) {
  let cursor: string | undefined;
  let fetched = 0;
  while (fetched < limit) {
    const res: any = await rq(P.paths.mediaComments(mediaId, cursor));
    const items = res?.items || res?.data || res?.result || [];
    for (const it of items) { yield it; fetched++; if (fetched >= limit) return; }
    cursor = res?.next_cursor || res?.end_cursor || res?.paging?.cursors?.after;
    if (!cursor) break;
  }
}

export async function *searchByHashtag(tag: string, limit = 400) {
  let cursor: string | undefined;
  let fetched = 0;
  while (fetched < limit) {
    const res: any = await rq(P.paths.searchHashtag(tag, cursor));
    const items = res?.items || res?.data || res?.result || [];
    for (const it of items) { yield it; fetched++; if (fetched >= limit) return; }
    cursor = res?.next_cursor || res?.end_cursor || res?.paging?.cursors?.after;
    if (!cursor) break;
  }
}

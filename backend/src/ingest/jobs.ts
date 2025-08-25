import { Pool } from 'pg';
import { searchByHashtag, iterateMediaComments } from '../services/instagram';
import { triSentiment } from '../utils/sentiment';

const pool = new Pool();

const aliases = (process.env.BRAND_ALIASES||'').split(',').map(s=>s.trim()).filter(Boolean);

function matchAlias(text: string): string | null {
  const t = (text||'').toLowerCase();
  for (const a of aliases) {
    if (!a) continue; const q = a.toLowerCase();
    if (t.includes(q.replace(/^#/,'').replace(/^@/,'')) || t.includes(q)) return a;
  }
  return null;
}

export async function ingestByHashtags() {
  // Pull by every alias that is a hashtag
  const tags = aliases.filter(a=>a.startsWith('#')).map(a=>a.slice(1));
  for (const tag of tags) {
    for await (const post of searchByHashtag(tag, 500)) {
      const media_id = post?.id || post?.media?.id || post?.pk || post?.code;
      const owner_id = post?.owner?.id || post?.user?.id || post?.owner_id;
      const taken_at = new Date(post?.taken_at || post?.timestamp || Date.now());
      const caption = post?.caption?.text || post?.caption || '';
      const like_count = post?.like_count ?? post?.likes ?? 0;
      const comment_count = post?.comment_count ?? post?.comments_count ?? 0;
      const permalink = post?.permalink || post?.link || '';

      await pool.query(
        `INSERT INTO ig_post (media_id, code, owner_id, taken_at, caption, like_count, comment_count, permalink, raw)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (media_id) DO UPDATE SET
           like_count=EXCLUDED.like_count,
           comment_count=EXCLUDED.comment_count,
           raw=EXCLUDED.raw`,
        [media_id, post?.code||null, owner_id, taken_at, caption, like_count, comment_count, permalink, post]
      );

      const m = matchAlias(caption);
      if (m) {
        await pool.query(
          `INSERT INTO ig_mention (media_id, source, matched_as, author_id, created_at)
           VALUES ($1,'caption',$2,$3,$4)`,
          [media_id, m, owner_id, taken_at.toISOString().slice(0,10)]
        );
      }

      // Comments
      let authors = new Set<string>();
      let pos=0, neg=0, neu=0;
      for await (const c of iterateMediaComments(media_id, 500)) {
        const comment_id = c?.id || c?.pk || `${media_id}:${c?.user_id}:${c?.created_at}`;
        const author_id = c?.user_id || c?.user?.id || c?.owner_id || null;
        const text = c?.text || '';
        const created = new Date(c?.created_at || c?.timestamp || Date.now());
        const s = triSentiment(text);
        if (s>0) pos++; else if (s<0) neg++; else neu++;
        if (author_id) authors.add(String(author_id));

        await pool.query(
          `INSERT INTO ig_comment (comment_id, media_id, author_id, text, created_at, sentiment, raw)
           VALUES ($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (comment_id) DO NOTHING`,
          [comment_id, media_id, author_id, text, created, s, c]
        );

        const m2 = matchAlias(text);
        if (m2) {
          await pool.query(
            `INSERT INTO ig_mention (media_id, source, matched_as, author_id, created_at)
             VALUES ($1,'comment',$2,$3,$4)`,
            [media_id, m2, author_id, created.toISOString().slice(0,10)]
          );
        }
      }

      // Daily rollup update
      await pool.query(
        `INSERT INTO ig_daily_metrics (brand_id, day, mentions, pos, neg, neu, est_reach, likes, comments, unique_authors)
         VALUES (1, $1,
                 (SELECT COUNT(*) FROM ig_mention WHERE media_id=$2),
                 $3,$4,$5,
                 COALESCE($6,0),
                 $7,$8,$9)
         ON CONFLICT (brand_id, day) DO UPDATE SET
           mentions = ig_daily_metrics.mentions + EXCLUDED.mentions,
           pos = ig_daily_metrics.pos + EXCLUDED.pos,
           neg = ig_daily_metrics.neg + EXCLUDED.neg,
           neu = ig_daily_metrics.neu + EXCLUDED.neu,
           est_reach = ig_daily_metrics.est_reach + EXCLUDED.est_reach,
           likes = ig_daily_metrics.likes + EXCLUDED.likes,
           comments = ig_daily_metrics.comments + EXCLUDED.comments,
           unique_authors = GREATEST(ig_daily_metrics.unique_authors, EXCLUDED.unique_authors)`,
        [taken_at.toISOString().slice(0,10), media_id, pos, neg, neu,
         (post?.owner?.followers || post?.user?.follower_count || (like_count + 4*comment_count)),
         like_count, comment_count, authors.size]
      );
    }
  }
}

import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
app.use(cors());
const db = new Pool();

app.get('/api/metrics/overview', async (req, res) => {
  const { from, to } = req.query as any;
  const rows = await db.query(
    `SELECT day,
            mentions, pos, neg, neu,
            est_reach, likes, comments, unique_authors
       FROM ig_daily_metrics
      WHERE brand_id = 1 AND day BETWEEN $1 AND $2
      ORDER BY day`, [from, to]
  );

  const total = rows.rows.reduce((acc, r) => ({
    mentions: acc.mentions + r.mentions,
    pos: acc.pos + r.pos, neg: acc.neg + r.neg, neu: acc.neu + r.neu,
    est_reach: acc.est_reach + Number(r.est_reach),
    likes: acc.likes + Number(r.likes), comments: acc.comments + Number(r.comments)
  }), {mentions:0,pos:0,neg:0,neu:0,est_reach:0,likes:0,comments:0});

  res.json({ total, series: rows.rows });
});

app.get('/api/mentions/latest', async (req, res) => {
  const limit = Number(req.query.limit || 20);
  const rows = await db.query(
    `SELECT m.created_at, m.matched_as, p.permalink, p.caption, p.like_count, p.comment_count
       FROM ig_mention m
       JOIN ig_post p ON p.media_id = m.media_id
      ORDER BY m.created_at DESC
      LIMIT $1`, [limit]
  );
  res.json(rows.rows);
});

app.get('/api/sentiment/series', async (req, res) => {
  const { from, to } = req.query as any;
  const rows = await db.query(
    `SELECT day, pos, neg, neu FROM ig_daily_metrics
      WHERE brand_id=1 AND day BETWEEN $1 AND $2 ORDER BY day`, [from, to]
  );
  res.json(rows.rows);
});

const port = process.env.PORT || 4001;
app.listen(port, () => console.log('API listening on', port));

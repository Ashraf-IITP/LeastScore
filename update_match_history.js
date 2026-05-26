const fs = require('fs');
const rulesContent = fs.readFileSync('pages/rules.js', 'utf8');
const match1 = rulesContent.indexOf('const GLOBAL_CSS');
const match2 = rulesContent.indexOf('export default function Rules');
const sharedComponents = rulesContent.substring(match1, match2);

const matchHistoryContent = `import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  MiniCardRow,
  LastDrawChip,
  LastDiscardChips,
  MiniCard,
  HiddenDeckChip,
  HiddenDeckWithCount,
} from './PlayingCard';

${sharedComponents}

const MODE_LABELS = {
  online: 'Online Match',
  friends: 'Play with Friends',
  ai: 'Play with AI',
  play_along: 'Play Along',
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function nameAt(participants, seat) {
  const p = participants.find((x) => x.seatIndex === seat);
  return p ? p.username : \`Player \${seat + 1}\`;
}

function MoveSummary({ move, participants }) {
  switch (move.eventType) {
    case 'deal':
      return <span style={{ color: '#F0F4FF' }}>{move.payload?.label || 'New deal'}</span>;
    case 'turn': {
      const actor = nameAt(participants, move.actingPlayer);
      const fromDeck = move.payload?.drawFrom === 'deck';
      const drawn = move.payload?.drawnCard;
      const discards = move.payload?.discardCards || [];
      return (
        <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', color: '#A8B4C2' }}>
          <strong style={{ color: '#FFC857' }}>{actor}</strong>
          <span>drew from {fromDeck ? 'deck' : 'visible'}</span>
          {fromDeck ? <HiddenDeckChip /> : drawn ? <MiniCard card={drawn} /> : null}
          <span>· discarded</span>
          {discards.length > 0 ? (
            <span style={{ display: 'inline-flex', gap: '3px' }}>
              {discards.map((c, i) => (
                <MiniCard key={i} card={c} />
              ))}
            </span>
          ) : (
            <span>—</span>
          )}
        </span>
      );
    }
    case 'declare': {
      const actor = nameAt(participants, move.actingPlayer);
      const won = move.payload?.declaredWon ? 'successful' : 'failed';
      return (
        <span style={{ color: move.payload?.declaredWon ? '#4ade80' : '#FC8181' }}>
          <strong style={{ color: '#FFC857' }}>{actor}</strong> declared ({won})
        </span>
      );
    }
    case 'eliminate':
      return (
        <span style={{ color: '#FC8181' }}>
          <strong style={{ color: '#FFC857' }}>{nameAt(participants, move.actingPlayer)}</strong> eliminated ({move.payload?.reason || 'unknown'})
        </span>
      );
    case 'disconnect':
      return (
        <span style={{ color: '#8896A7' }}>
          <strong style={{ color: '#FFC857' }}>{nameAt(participants, move.actingPlayer)}</strong> disconnected
        </span>
      );
    case 'poll_start':
      return <span style={{ color: '#F0F4FF' }}>Elimination vote started for <strong style={{ color: '#FFC857' }}>{nameAt(participants, move.actingPlayer)}</strong></span>;
    case 'bots_only_end':
      return <span style={{ color: '#8896A7' }}>{move.payload?.message || 'Match ended — only bots remained'}</span>;
    case 'game_end': {
      const winner = move.payload?.winner;
      if (typeof winner === 'number') {
        return <span style={{ color: '#4ade80' }}>Match ended — winner: <strong style={{ color: '#FFC857' }}>{nameAt(participants, winner)}</strong></span>;
      }
      return <span style={{ color: '#A8B4C2' }}>Match ended</span>;
    }
    default:
      return <span style={{ color: '#F0F4FF' }}>{move.eventType}</span>;
  }
}

function LastActionRow({ label, children, bordered = false }) {
  return (
    <div
      style={{
        flex: 1,
        textAlign: 'center',
        ...(bordered ? { borderLeft: '1px solid rgba(255,255,255,0.1)' } : {}),
      }}
    >
      <div
        style={{
          fontSize: '9px',
          color: '#8896A7',
          textTransform: 'uppercase',
          marginBottom: '4px',
          fontWeight: 'bold',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}

function PlayerHandsPanel({ state }) {
  if (!state?.players) return null;
  return (
    <div style={{ marginTop: '12px' }}>
      {state.players.map((p) => (
        <div
          key={p.seatIndex}
          style={{
            marginBottom: '12px',
            padding: '12px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <strong style={{ color: '#F0F4FF' }}>
            {p.username}
            {p.isBot ? ' (Bot)' : ''}
            {p.eliminated ? ' — eliminated' : ''}
          </strong>
          <div style={{ fontSize: '13px', color: '#8896A7', marginTop: '4px' }}>
            Score: <strong style={{ color: '#FFC857' }}>{p.score}</strong>
            {typeof state.currentPlayer === 'number' && state.currentPlayer === p.seatIndex && !p.eliminated
              ? ' · Current turn'
              : ''}
            {p.eliminatedReason ? \` · \${p.eliminatedReason}\` : ''}
          </div>

          <div
            style={{
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <LastActionRow label="Last Draw">
              <LastDrawChip card={p.lastDrawnCard} fromDeck={p.lastDrawnFrom === 'deck'} />
            </LastActionRow>
            <LastActionRow label="Last Discard" bordered>
              <LastDiscardChips cards={p.lastDiscard} />
            </LastActionRow>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div
              style={{
                fontSize: '9px',
                color: '#8896A7',
                textTransform: 'uppercase',
                marginBottom: '6px',
                fontWeight: 'bold',
              }}
            >
              Hand
            </div>
            <MiniCardRow cards={p.hand} emptyLabel="(empty)" />
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: '8px',
          padding: '12px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          style={{
            fontSize: '9px',
            color: '#8896A7',
            textTransform: 'uppercase',
            marginBottom: '6px',
            fontWeight: 'bold',
          }}
        >
          Visible pile
        </div>
        <MiniCardRow cards={state.visibleCard} emptyLabel="—" />
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            style={{
              fontSize: '9px',
              color: '#8896A7',
              textTransform: 'uppercase',
              marginBottom: '6px',
              fontWeight: 'bold',
            }}
          >
            Hidden deck
          </div>
          <HiddenDeckWithCount count={state.deckCount ?? 0} />
        </div>
      </div>
    </div>
  );
}

function RoundSummaryPanel({ summary }) {
  if (!summary?.players) return null;
  return (
    <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,200,87,0.05)', borderRadius: '12px', border: '1px solid rgba(255,200,87,0.2)' }}>
      <strong style={{ color: '#FFC857' }}>Round summary</strong>
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {summary.players.map((p, idx) => (
          <div key={idx}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#F0F4FF' }}>
              {p.username}
              {Number.isFinite(p.sum) ? \` · hand sum \${p.sum === Infinity ? '—' : p.sum}\` : ''}
            </div>
            <MiniCardRow cards={p.hand} emptyLabel="(no hand)" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MatchHistory({ onBack }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [expandedMove, setExpandedMove] = useState(null);
  const [leaderboardExpanded, setLeaderboardExpanded] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/matches');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load matches');
        if (!cancelled) setMatches(data.matches || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setDetailLoading(true);
      setError('');
      try {
        const res = await fetch(\`/api/matches/\${selectedId}\`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load match');
        if (!cancelled) {
          setDetail(data.match);
          setExpandedMove(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedId]);

  if (selectedId && detail) {
    const rankedPlayers = [...detail.participants].sort((a, b) => {
        if (a.placement && b.placement) return a.placement - b.placement;
        if (a.finalScore != null && b.finalScore != null) return a.finalScore - b.finalScore;
        return 0;
    });

    const rankClass = (index, total) => {
        if (index === 0) return 'gold';
        if (total > 3 && index === 1) return 'silver';
        if (total > 3 && index === 2) return 'bronze';
        return 'default';
    };
    const medal = (index, total) => {
        if (index === 0) return '🥇';
        if (total > 3 && index === 1) return '🥈';
        if (total > 3 && index === 2) return '🥉';
        return '';
    };

    return (
      <PageShell>
        <LogoHeader subtitle="Match Details" />
        <div className="ls-card view-animate">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button type="button" onClick={() => setSelectedId(null)} className="btn-back" style={{ margin: 0 }}>
              ← Back
            </button>
            <span className="ls-badge blue">Match #{detail.id}</span>
          </div>

          <h2 className="ls-section-title" style={{ fontSize: '20px', marginBottom: '4px' }}>
            {MODE_LABELS[detail.mode] || detail.mode}
          </h2>
          <p style={{ color: '#8896A7', fontSize: '13px', marginBottom: '24px' }}>
            {formatDate(detail.startedAt)}
            {detail.endedAt ? \` → \${formatDate(detail.endedAt)}\` : ' (in progress)'}
            {detail.endReason ? \` · End: \${detail.endReason}\` : ''}
          </p>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <strong style={{ color: '#F0F4FF', fontSize: '16px' }}>Leaderboard</strong>
              <button 
                type="button" 
                onClick={() => setLeaderboardExpanded(!leaderboardExpanded)} 
                className="btn-icon" 
              >
                {leaderboardExpanded ? 'Hide' : 'Show'}
              </button>
            </div>
            {leaderboardExpanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {rankedPlayers.map((player, index) => {
                    const total = rankedPlayers.length;
                    const cls = rankClass(index, total);
                    let bg = 'rgba(255,255,255,0.03)';
                    let border = '1px solid rgba(255,255,255,0.06)';
                    let scoreColor = '#F0F4FF';
                    
                    if (cls === 'gold') {
                      bg = 'rgba(255,200,87,0.1)';
                      border = '1px solid rgba(255,200,87,0.3)';
                      scoreColor = '#FFC857';
                    } else if (cls === 'silver') {
                      bg = 'rgba(203,213,225,0.1)';
                      border = '1px solid rgba(203,213,225,0.3)';
                      scoreColor = '#cbd5e1';
                    } else if (cls === 'bronze') {
                      bg = 'rgba(217,119,6,0.1)';
                      border = '1px solid rgba(217,119,6,0.3)';
                      scoreColor = '#d97706';
                    }

                    return (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '16px', background: bg, border: border }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '22px', minWidth: '28px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{medal(index, total)}</span>
                                <div>
                                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#F0F4FF' }}>{player.username}</p>
                                    <div style={{ display: 'flex', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
                                        {player.isBot && <span className="ls-badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#A8B4C2', border: '1px solid rgba(255,255,255,0.15)' }}>Bot</span>}
                                        {player.placement && <span className="ls-badge blue">Placement: #{player.placement}</span>}
                                    </div>
                                </div>
                            </div>
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', color: scoreColor, letterSpacing: '1px' }}>
                                {player.finalScore != null ? player.finalScore : ''}
                            </span>
                        </div>
                    );
                })}
              </div>
            )}
          </div>

          <strong style={{ color: '#F0F4FF', fontSize: '16px', display: 'block', marginBottom: '12px' }}>Moves ({detail.moves.length})</strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {detail.moves.map((move) => (
              <div
                key={move.moveNumber}
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: expandedMove === move.moveNumber ? 'rgba(58,77,255,0.08)' : 'rgba(255,255,255,0.02)',
                  transition: 'background 0.2s',
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedMove(expandedMove === move.moveNumber ? null : move.moveNumber)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#F0F4FF',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: expandedMove === move.moveNumber ? '#7B8FFF' : '#A8B4C2' }}>#{move.moveNumber}</strong>
                    <MoveSummary move={move} participants={detail.participants} />
                  </div>
                </button>
                {expandedMove === move.moveNumber && move.payload?.state && (
                  <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <PlayerHandsPanel state={move.payload.state} />
                    <RoundSummaryPanel summary={move.payload.roundSummary} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <LogoHeader subtitle="Your Past Games" />
      <div className="ls-card view-animate">
        <button type="button" onClick={onBack} className="btn-back">
          ← Main menu
        </button>
        <h2 className="ls-section-title">Match History</h2>
        <p className="ls-section-desc">
          Review every move from your online, friends, and AI matches. Pass and Play, Play Along, and Tutorial games are not recorded.
        </p>
        
        {loading && (
          <div style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
            <div className="ls-spinner" />
          </div>
        )}
        
        {error && <div className="ls-alert-error">{error}</div>}
        
        {!loading && !error && matches.length === 0 && (
          <div className="ls-alert-info" style={{ textAlign: 'center', padding: '20px' }}>
            No recorded matches yet. Play a match with at least one registered player to build history.
          </div>
        )}
        
        {!loading && matches.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {matches.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedId(m.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '16px 20px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, background 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#F0F4FF', fontSize: '15px' }}>
                    {MODE_LABELS[m.mode] || m.mode}
                  </strong>
                  <span className="ls-badge blue">{m.playerCount} Players</span>
                </div>
                
                <div style={{ fontSize: '13px', color: '#8896A7', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <span>{formatDate(m.startedAt)}</span>
                  {m.myPlacement && <span style={{ color: '#FFC857' }}>· Placement: #{m.myPlacement}</span>}
                  {m.myScore != null && <span style={{ color: '#4ade80' }}>· Score: {m.myScore}</span>}
                  {m.endReason === 'bots_only' && <span>· Ended (bots only)</span>}
                </div>
                
                <div style={{ fontSize: '12px', color: '#A8B4C2', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', marginTop: '4px' }}>
                  <span style={{ opacity: 0.7 }}>Players:</span> <span style={{ color: '#F0F4FF' }}>{m.participants.map((p) => p.username).join(', ')}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {selectedId && detailLoading && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div className="ls-spinner" />
          </div>
        )}
      </div>
    </PageShell>
  );
}
`;
fs.writeFileSync('components/MatchHistory.js', matchHistoryContent);

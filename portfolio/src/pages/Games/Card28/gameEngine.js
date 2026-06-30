// src/pages/Games/Card28/gameEngine.js
import { createDeck, shuffle, dealInitial, dealRemaining, RANK_ORDER, CARD_POINTS } from "./deck";
import {
  findPairHolder, adjustBidForPair, calculateGamePoints,
  applyGamePoints, isGameOver, clampScore, checkCancellation,
} from "./scoring";

export const PHASES = {
  DEALING:      "dealing",
  BIDDING:      "bidding",
  TRUMP_STYLE:  "trump_style",
  TRUMP_PICK:   "trump_pick",
  PLAYING:      "playing",
  ROUND_END:    "round_end",
  GAME_END:     "game_end",
  CANCELLED:    "cancelled",
};

export const MIN_BID = 16;
export const MAX_BID = 28;

export function createPlayers(playerCount, names, isBot) {
  return Array.from({ length: playerCount }, (_, i) => ({
    id: i,
    name: names?.[i] ?? `Player ${i + 1}`,
    isBot: isBot ? isBot(i) : i !== 0,
    hand: [],
    tricksWon: [],
    team: playerCount === 4 ? i % 2 : i,
  }));
}

export function createInitialState(playerCount = 4, names = null, isBot = null) {
  const players = createPlayers(playerCount, names, isBot);
  return {
    playerCount,
    players,
    phase: PHASES.DEALING,
    dealerIndex: 0,
    currentTurn: null,
    deck: [],
    remainingCards: [],
    bids: {},
    currentBid: { playerId: null, amount: 0 },
    biddingTurn: null,
    isDouble: false,
    trumpSuit: null,
    trumpCaller: null,
    trumpRevealed: false,
    trumpStyle: null,
    closedTrumpCard: null,
    trumpLedBefore: false,
    exposeCalledBy: null,
    tricksPlayedSinceTrumpHidden: 0,
    pairHolder: null,
    adjustedTarget: null,
    currentTrick: [],
    leadSuit: null,
    teamScores: playerCount === 4 ? { 0: 0, 1: 0 } : {},
    livePoints: playerCount === 4 ? { 0: 0, 1: 0 } : {},
    roundNumber: 1,
    gameLog: [],
    winner: null,
    cancelReason: null,
  };
}

export const ACTIONS = {
  START_ROUND:        "START_ROUND",
  PLACE_BID:          "PLACE_BID",
  PASS_BID:           "PASS_BID",
  SET_DOUBLE:         "SET_DOUBLE",
  CHOOSE_TRUMP_STYLE: "CHOOSE_TRUMP_STYLE",
  PICK_TRUMP:         "PICK_TRUMP",
  CALL_EXPOSE:        "CALL_EXPOSE",
  PLAY_CARD:          "PLAY_CARD",
  ACKNOWLEDGE_CANCEL: "ACKNOWLEDGE_CANCEL",
  CLAIM_ROUND:        "CLAIM_ROUND",
};

function nextPlayerIndex(idx, count) {
  return (idx + 1) % count;
}

function log(state, message) {
  return { ...state, gameLog: [...state.gameLog.slice(-49), message] };
}

// ─────────────────────────────────────────────────────────────
// getLegalMoves
//
// NOTE: the bidder-cannot-lead-trump-unless-forced restriction has been
// intentionally REMOVED per house rules. The bidder (or anyone) may lead
// trump on any trick, any time, in both Open and Closed trump modes.
// ─────────────────────────────────────────────────────────────
export function getLegalMoves(state, playerId) {
  const player = state.players[playerId];
  const hand = player.hand;

  // Leading the trick — anyone may lead any card, trump included, always.
  if (state.currentTrick.length === 0) {
    return hand;
  }

  const leadSuit = state.leadSuit;
  const hasLeadSuit = hand.some(c => c.suit === leadSuit);

  if (hasLeadSuit) {
    return hand.filter(c => c.suit === leadSuit);
  }

  // Can't follow suit.
  if (state.trumpStyle === "closed" && state.exposeCalledBy === playerId) {
    // This player just called for exposure — must play trump if they have any.
    const trumpCards = hand.filter(c => c.suit === state.trumpSuit);
    return trumpCards.length > 0 ? trumpCards : hand;
  }

  if (state.trumpStyle === "closed" && !state.trumpRevealed) {
    // Trump still hidden, nobody called exposure this turn — discard freely,
    // it cannot win the trick (enforced in resolveTrickWinner).
    return hand;
  }

  // Open trump (or already-revealed closed trump): anything goes, and it
  // CAN win normally via resolveTrickWinner.
  return hand;
}

export function canCallExpose(state, playerId) {
  if (state.trumpStyle !== "closed" || state.trumpRevealed) return false;
  if (state.currentTrick.length === 0) return false;
  const hand = state.players[playerId].hand;
  const hasLeadSuit = hand.some(c => c.suit === state.leadSuit);
  return !hasLeadSuit;
}

function resolveTrickWinner(state, trick) {
  const { trumpSuit, leadSuit, trumpStyle, trumpRevealed } = state;
  const trumpIsLive = trumpStyle !== "closed" || trumpRevealed;

  const trumpPlays = trumpIsLive ? trick.filter(t => t.card.suit === trumpSuit) : [];
  const pool = trumpPlays.length > 0
    ? trumpPlays
    : trick.filter(t => t.card.suit === leadSuit);

  let winner = pool[0];
  for (const play of pool.slice(1)) {
    const a = RANK_ORDER.indexOf(play.card.rank);
    const b = RANK_ORDER.indexOf(winner.card.rank);
    if (a < b) winner = play;
  }
  return winner.playerId;
}

function trickPoints(trick) {
  return trick.reduce((sum, t) => sum + CARD_POINTS[t.card.rank], 0);
}

// ── Main reducer ────────────────────────────────────────────────
export function applyAction(state, action) {
  switch (action.type) {

    case ACTIONS.START_ROUND: {
      const deck = shuffle(createDeck());
      const { hands, remaining } = dealInitial(deck, state.playerCount);
      let players = state.players.map((p, i) => ({
        ...p, hand: hands[i], tricksWon: [],
      }));

      const firstBidder = nextPlayerIndex(state.dealerIndex, state.playerCount);
      const livePoints = state.playerCount === 4 ? { 0: 0, 1: 0 } : {};

      return log({
        ...state,
        players,
        deck,
        remainingCards: remaining,
        phase: PHASES.BIDDING,
        bids: {},
        currentBid: { playerId: null, amount: 0 },
        biddingTurn: firstBidder,
        isDouble: false,
        trumpSuit: null,
        trumpCaller: null,
        trumpRevealed: false,
        trumpStyle: null,
        closedTrumpCard: null,
        trumpLedBefore: false,
        exposeCalledBy: null,
        tricksPlayedSinceTrumpHidden: 0,
        pairHolder: null,
        adjustedTarget: null,
        currentTrick: [],
        leadSuit: null,
        livePoints,
        cancelReason: null,
      }, `Round ${state.roundNumber} — cards dealt`);
    }

    case ACTIONS.SET_DOUBLE: {
      if (state.phase !== PHASES.BIDDING && state.phase !== PHASES.TRUMP_PICK) return state;
      return log({ ...state, isDouble: action.isDouble },
        action.isDouble ? "Stakes DOUBLED 🔥" : "Playing single stakes");
    }

    case ACTIONS.PLACE_BID: {
      const { playerId, amount } = action;
      if (state.phase !== PHASES.BIDDING) return state;
      if (amount <= state.currentBid.amount || amount > MAX_BID) return state;

      const bids = { ...state.bids, [playerId]: amount };
      const activeBidders = state.players.map((_, i) => i).filter(i => bids[i] !== "pass");
      const nextTurn = getNextBidder(state, playerId, bids);

      let next = log({
        ...state, bids, currentBid: { playerId, amount }, biddingTurn: nextTurn,
      }, `${state.players[playerId].name} bids ${amount}`);

      if (activeBidders.length === 1 || nextTurn === null) {
        next = finishBidding(next);
      }
      return next;
    }

    case ACTIONS.PASS_BID: {
      const { playerId } = action;
      if (state.phase !== PHASES.BIDDING) return state;

      const bids = { ...state.bids, [playerId]: "pass" };
      const activeBidders = state.players.map((_, i) => i).filter(i => bids[i] !== "pass");
      let next = log({ ...state, bids }, `${state.players[playerId].name} passes`);

      if (activeBidders.length <= 1) {
        next = finishBidding({ ...next, biddingTurn: null });
      } else {
        next = { ...next, biddingTurn: getNextBidder(next, playerId, bids) };
      }
      return next;
    }

    case ACTIONS.CHOOSE_TRUMP_STYLE: {
      const { style } = action;
      if (state.phase !== PHASES.TRUMP_STYLE) return state;
      return log({ ...state, phase: PHASES.TRUMP_PICK, trumpStyle: style },
        `${state.players[state.trumpCaller].name} will play with trump ${style.toUpperCase()}`);
    }

    case ACTIONS.PICK_TRUMP: {
      const { suit } = action;
      if (state.phase !== PHASES.TRUMP_PICK) return state;

      const newHands = dealRemaining(state.remainingCards, state.players.map(p => p.hand), state.playerCount);
      let players = state.players.map((p, i) => ({ ...p, hand: newHands[i] }));

      const cancel1 = checkCancellation(players, null);
      if (cancel1.cancelled) {
        return log({ ...state, players, phase: PHASES.CANCELLED, cancelReason: cancel1.reason },
          `Round cancelled: ${cancel1.reason}`);
      }

      const cancel2 = checkCancellation(players, suit);
      if (cancel2.cancelled) {
        return log({ ...state, players, phase: PHASES.CANCELLED, cancelReason: cancel2.reason },
          `Round cancelled: ${cancel2.reason}`);
      }

      const isClosed = state.trumpStyle === "closed";
      const closedTrumpCard = isClosed ? { suit } : null;

      const callerTeam = players[state.trumpCaller].team;
      const biddingTeamHands   = players.filter(p => p.team === callerTeam).map(p => p.hand);
      const defendingTeamHands = players.filter(p => p.team !== callerTeam).map(p => p.hand);
      const pairHolder = state.playerCount === 4
        ? findPairHolder(biddingTeamHands, defendingTeamHands, suit)
        : null;
      const adjustedTarget = pairHolder
        ? adjustBidForPair(state.currentBid.amount, pairHolder)
        : state.currentBid.amount;

      if (isClosed) {
        return log({
          ...state,
          players,
          trumpSuit: suit,
          trumpRevealed: false,
          trumpLedBefore: false,
          closedTrumpCard,
          pairHolder,
          adjustedTarget,
          phase: PHASES.PLAYING,
          currentTurn: state.trumpCaller,
          currentTrick: [],
          leadSuit: null,
          remainingCards: [],
        }, `${state.players[state.trumpCaller].name} sets trump face down (CLOSED)`);
      }

      return log({
        ...state,
        players,
        trumpSuit: suit,
        trumpRevealed: true,
        trumpLedBefore: false,
        closedTrumpCard: null,
        pairHolder,
        adjustedTarget,
        phase: PHASES.PLAYING,
        currentTurn: state.trumpCaller,
        currentTrick: [],
        leadSuit: null,
        remainingCards: [],
      }, pairHolder
          ? `Trump is ${suit} — Pair found! (${pairHolder} team, target now ${adjustedTarget})`
          : `Trump is ${suit}`
      );
    }

    case ACTIONS.CALL_EXPOSE: {
      const { playerId } = action;
      if (state.phase !== PHASES.PLAYING) return state;
      if (state.trumpStyle !== "closed" || state.trumpRevealed) return state;
      if (!canCallExpose(state, playerId)) return state;

      return log({
        ...state,
        trumpRevealed: true,
        exposeCalledBy: playerId,
      }, `${state.players[playerId].name} calls for trump to be exposed — it's ${state.trumpSuit}!`);
    }

    case ACTIONS.PLAY_CARD: {
      const { playerId, card } = action;
      if (state.phase !== PHASES.PLAYING) return state;
      if (state.currentTurn !== playerId) return state;

      const legal = getLegalMoves(state, playerId);
      if (!legal.some(c => c.id === card.id)) return state;

      const players = state.players.map(p =>
        p.id === playerId ? { ...p, hand: p.hand.filter(c => c.id !== card.id) } : p
      );
      const newTrick = [...state.currentTrick, { playerId, card }];
      const leadSuit = state.leadSuit ?? card.suit;
      const isLeadingTrump = state.currentTrick.length === 0 && card.suit === state.trumpSuit;

      let next = log({
        ...state, players, currentTrick: newTrick, leadSuit,
        trumpLedBefore: state.trumpLedBefore || isLeadingTrump,
      }, `${state.players[playerId].name} plays ${card.rank}${card.suit}`);

      if (newTrick.length === state.playerCount) {
        next = resolveCompletedTrick(next);
      } else {
        next = { ...next, currentTurn: nextPlayerIndex(playerId, state.playerCount) };
      }
      return next;
    }

    case ACTIONS.ACKNOWLEDGE_CANCEL: {
      return applyAction({ ...state, phase: PHASES.DEALING }, { type: ACTIONS.START_ROUND });
    }

    case ACTIONS.CLAIM_ROUND: {
      if (state.phase !== PHASES.PLAYING) return state;
      return log(finishRound(state), "Round claimed early — outcome was already certain");
    }

    default:
      return state;
  }
}

function getNextBidder(state, fromPlayer, bids) {
  let idx = nextPlayerIndex(fromPlayer, state.playerCount);
  for (let i = 0; i < state.playerCount; i++) {
    if (bids[idx] !== "pass") return idx;
    idx = nextPlayerIndex(idx, state.playerCount);
  }
  return null;
}

function finishBidding(state) {
  const winner = state.currentBid.playerId;
  if (winner === null) {
    return { ...state, phase: PHASES.DEALING };
  }
  return log({ ...state, phase: PHASES.TRUMP_STYLE, trumpCaller: winner, biddingTurn: null },
    `${state.players[winner].name} won the bid at ${state.currentBid.amount}`);
}

function resolveCompletedTrick(state) {
  const winnerId = resolveTrickWinner(state, state.currentTrick);
  const points   = trickPoints(state.currentTrick);

  const players = state.players.map(p =>
    p.id === winnerId ? { ...p, tricksWon: [...p.tricksWon, { cards: state.currentTrick, points }] } : p
  );

  let livePoints = state.livePoints;
  if (state.playerCount === 4) {
    const winnerTeam = players[winnerId].team;
    livePoints = { ...livePoints, [winnerTeam]: (livePoints[winnerTeam] ?? 0) + points };
  } else {
    livePoints = { ...livePoints, [winnerId]: (livePoints[winnerId] ?? 0) + points };
  }

  const isClosedHidden = state.trumpStyle === "closed" && !state.trumpRevealed;
  const tricksHidden = isClosedHidden
    ? state.tricksPlayedSinceTrumpHidden + 1
    : state.tricksPlayedSinceTrumpHidden;

  let next = log({
    ...state, players, currentTrick: [], leadSuit: null, currentTurn: winnerId,
    livePoints, exposeCalledBy: null, tricksPlayedSinceTrumpHidden: tricksHidden,
  }, `${state.players[winnerId].name} wins the trick (+${points} pts)`);

  if (isClosedHidden && tricksHidden >= 7) {
    return log({
      ...next,
      phase: PHASES.CANCELLED,
      cancelReason: "Closed trump was never exposed within the first 7 tricks — round invalid",
    }, "Round invalid: trump never exposed in time");
  }

  if (players[0].hand.length === 0) {
    next = finishRound(next);
  }
  return next;
}

function finishRound(state) {
  const target = state.adjustedTarget ?? state.currentBid.amount;

  if (state.playerCount === 4) {
    const callerTeam = state.players[state.trumpCaller].team;
    const team0Points = state.livePoints[0] ?? 0;
    const team1Points = state.livePoints[1] ?? 0;
    const callerPoints = callerTeam === 0 ? team0Points : team1Points;

    const { won, gamePoints, isFullHouse, isDoubled } =
      calculateGamePoints(state.currentBid.amount, target, callerPoints);

    const stakeMultiplier = state.isDouble ? 2 : 1;
    const finalGamePoints = gamePoints * stakeMultiplier;

    const teamScores = { ...state.teamScores };
    // Opposing team's score NEVER changes — only the bidding team's own
    // tally moves, up on a win, down on a loss.
    teamScores[callerTeam] = clampScore(
      applyGamePoints(teamScores[callerTeam] ?? 0, finalGamePoints, won)
    );

    const gameOver = isGameOver(teamScores[0]) || isGameOver(teamScores[1]);
    const result = {
      team0Points, team1Points, callerTeam, bidMade: won,
      bidAmount: state.currentBid.amount, adjustedTarget: target,
      pairHolder: state.pairHolder, gamePoints: finalGamePoints,
      isFullHouse, isDoubled, isDouble: state.isDouble,
    };

    return log({
      ...state,
      phase: gameOver ? PHASES.GAME_END : PHASES.ROUND_END,
      teamScores,
      lastResult: result,
      winner: gameOver ? (teamScores[0] >= 6 ? 0 : teamScores[1] >= 6 ? 1 : (teamScores[0] > teamScores[1] ? 0 : 1)) : null,
    }, won
        ? `Team ${callerTeam} made their bid! +${finalGamePoints} pts ${isFullHouse ? "(FULL HOUSE!)" : ""}`
        : `Team ${callerTeam} failed (${isDoubled ? "DOUBLED " : ""}-${finalGamePoints} pts)`
    );
  }

  const playerPoints = {};
  state.players.forEach(p => { playerPoints[p.id] = state.livePoints[p.id] ?? 0; });
  const callerPoints = playerPoints[state.trumpCaller];
  const bidMade = callerPoints >= target;

  return log({
    ...state,
    phase: PHASES.ROUND_END,
    lastResult: { playerPoints, bidMade, bidAmount: state.currentBid.amount, adjustedTarget: target, caller: state.trumpCaller },
  }, bidMade
      ? `${state.players[state.trumpCaller].name} made their bid!`
      : `${state.players[state.trumpCaller].name} failed their bid`
  );
}

export function startNextRound(state) {
  const nextDealer = nextPlayerIndex(state.dealerIndex, state.playerCount);
  const fresh = { ...state, dealerIndex: nextDealer, roundNumber: state.roundNumber + 1, phase: PHASES.DEALING };
  return applyAction(fresh, { type: ACTIONS.START_ROUND });
}

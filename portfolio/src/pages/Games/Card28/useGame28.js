// src/pages/Games/Card28/useGame28.js
import { useState, useCallback, useEffect, useRef } from "react";
import {
  createInitialState, applyAction, startNextRound,
  ACTIONS, PHASES, getLegalMoves,
} from "./gameEngine";
import { botDecideBid, botPickTrump, botDecideCard } from "./botAI";
import { sortHand, SUITS } from "./deck";

const BOT_DELAY = 700; // ms — makes bot moves feel natural, not instant

export function useGame28(playerCount, humanName = "You") {
  const names = Array.from({ length: playerCount }, (_, i) =>
    i === 0 ? humanName : `Bot ${i}`
  );

  const [state, setState] = useState(() =>
    applyAction(createInitialState(playerCount, names), { type: ACTIONS.START_ROUND })
  );

  const botTimeout = useRef(null);

  // ── Human actions ────────────────────────────────────────────
  const placeBid = useCallback((amount) => {
    setState(s => applyAction(s, { type: ACTIONS.PLACE_BID, playerId: 0, amount }));
  }, []);

  const passBid = useCallback(() => {
    setState(s => applyAction(s, { type: ACTIONS.PASS_BID, playerId: 0 }));
  }, []);

  const pickTrump = useCallback((suit) => {
    setState(s => applyAction(s, { type: ACTIONS.PICK_TRUMP, suit }));
  }, []);

  const playCard = useCallback((card) => {
    setState(s => {
      if (s.currentTurn !== 0) return s;
      return applyAction(s, { type: ACTIONS.PLAY_CARD, playerId: 0, card });
    });
  }, []);

  const nextRound = useCallback(() => {
    setState(s => startNextRound(s));
  }, []);

  const resetGame = useCallback(() => {
    setState(applyAction(createInitialState(playerCount, names), { type: ACTIONS.START_ROUND }));
  }, [playerCount]);

  // ── Bot automation ───────────────────────────────────────────
  useEffect(() => {
    clearTimeout(botTimeout.current);

    // Bidding phase — bot's turn
    if (state.phase === PHASES.BIDDING && state.biddingTurn !== null && state.biddingTurn !== 0) {
      const botId = state.biddingTurn;
      botTimeout.current = setTimeout(() => {
        const decision = botDecideBid(state, botId);
        setState(s => {
          if (decision.type === "pass") {
            return applyAction(s, { type: ACTIONS.PASS_BID, playerId: botId });
          }
          return applyAction(s, { type: ACTIONS.PLACE_BID, playerId: botId, amount: decision.amount });
        });
      }, BOT_DELAY);
    }

    // Trump pick phase — bot won the bid
    if (state.phase === PHASES.TRUMP_PICK && state.trumpCaller !== 0) {
      botTimeout.current = setTimeout(() => {
        setState(s => {
          const botHand = s.players[s.trumpCaller].hand;
          // Bot needs full hand to decide — simulate seeing remaining cards
          const allPotential = [...botHand, ...s.remainingCards.filter((_, i) =>
            i % s.playerCount === s.trumpCaller
          )];
          const suit = botPickTrump(allPotential.length ? allPotential : botHand);
          return applyAction(s, { type: ACTIONS.PICK_TRUMP, suit });
        });
      }, BOT_DELAY);
    }

    // Playing phase — bot's turn to play a card
    if (state.phase === PHASES.PLAYING && state.currentTurn !== null && state.currentTurn !== 0) {
      const botId = state.currentTurn;
      botTimeout.current = setTimeout(() => {
        setState(s => {
          if (s.currentTurn !== botId) return s;
          const card = botDecideCard(s, botId);
          return applyAction(s, { type: ACTIONS.PLAY_CARD, playerId: botId, card });
        });
      }, BOT_DELAY);
    }

    return () => clearTimeout(botTimeout.current);
  }, [state]);

  // ── Derived helpers for UI ────────────────────────────────────
  const humanHand = sortHand(state.players[0]?.hand ?? [], state.trumpSuit);
  const legalMoves = state.phase === PHASES.PLAYING
    ? getLegalMoves(state, 0).map(c => c.id)
    : [];

  const isHumanTurn = state.phase === PHASES.PLAYING && state.currentTurn === 0;
  const isHumanBidTurn = state.phase === PHASES.BIDDING && state.biddingTurn === 0;
  const isHumanTrumpPick = state.phase === PHASES.TRUMP_PICK && state.trumpCaller === 0;

  return {
    state,
    humanHand,
    legalMoves,
    isHumanTurn,
    isHumanBidTurn,
    isHumanTrumpPick,
    actions: { placeBid, passBid, pickTrump, playCard, nextRound, resetGame },
  };
}
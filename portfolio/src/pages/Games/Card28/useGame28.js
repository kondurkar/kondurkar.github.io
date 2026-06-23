// src/pages/Games/Card28/useGame28.js
import { useState, useCallback, useEffect, useRef } from "react";
import {
  createInitialState, applyAction, startNextRound,
  ACTIONS, PHASES, getLegalMoves,
} from "./gameEngine";
import { botDecideBid, botPickTrump, botDecideCard } from "./botAI";
import { sortHand } from "./deck";

const BOT_DELAY = 900;        // ms before a bot acts — lets you see what's happening
const TRICK_CLEAR_DELAY = 1100; // ms to view the completed trick (incl. last bot's card) before it clears

export function useGame28(playerCount, humanName = "You") {
  const names = Array.from({ length: playerCount }, (_, i) =>
    i === 0 ? humanName : `Bot ${i}`
  );

  const [state, setState] = useState(() =>
    applyAction(createInitialState(playerCount, names), { type: ACTIONS.START_ROUND })
  );

  // Holds the just-completed trick on screen briefly before the engine clears it
  const [pendingTrick, setPendingTrick] = useState(null);
  const botTimeout   = useRef(null);
  const clearTimeout_ = useRef(null);

  // ── Human actions ────────────────────────────────────────────
  const placeBid = useCallback((amount) => {
    setState(s => applyAction(s, { type: ACTIONS.PLACE_BID, playerId: 0, amount }));
  }, []);

  const passBid = useCallback(() => {
    setState(s => applyAction(s, { type: ACTIONS.PASS_BID, playerId: 0 }));
  }, []);

  const setDouble = useCallback((isDouble) => {
    setState(s => applyAction(s, { type: ACTIONS.SET_DOUBLE, isDouble }));
  }, []);

  const pickTrump = useCallback((suit) => {
    setState(s => applyAction(s, { type: ACTIONS.PICK_TRUMP, suit }));
  }, []);

  // Wraps PLAY_CARD: if this play completes the trick, freeze the visual
  // trick on screen for TRICK_CLEAR_DELAY before the engine actually
  // advances (so the 4th/last card played is always visible).
  const submitCard = useCallback((playerId, card) => {
    setState(s => {
      if (s.currentTurn !== playerId) return s;
      const willComplete = s.currentTrick.length === s.playerCount - 1;

      if (willComplete) {
        // Show the full trick (including this card) frozen for a moment
        const frozenTrick = [...s.currentTrick, { playerId, card }];
        setPendingTrick(frozenTrick);
        clearTimeout(clearTimeout_.current);
        clearTimeout_.current = setTimeout(() => {
          setPendingTrick(null);
          setState(s2 => applyAction(s2, { type: ACTIONS.PLAY_CARD, playerId, card }));
        }, TRICK_CLEAR_DELAY);
        return s; // don't apply yet — wait for the timeout above
      }

      return applyAction(s, { type: ACTIONS.PLAY_CARD, playerId, card });
    });
  }, []);

  const playCard = useCallback((card) => submitCard(0, card), [submitCard]);

  const nextRound = useCallback(() => {
    setState(s => startNextRound(s));
  }, []);

  const resetGame = useCallback(() => {
    setState(applyAction(createInitialState(playerCount, names), { type: ACTIONS.START_ROUND }));
    setPendingTrick(null);
  }, [playerCount]);

  const acknowledgeCancel = useCallback(() => {
    setState(s => applyAction(s, { type: ACTIONS.ACKNOWLEDGE_CANCEL }));
  }, []);

  const claimRound = useCallback(() => {
    setState(s => applyAction(s, { type: ACTIONS.CLAIM_ROUND }));
  }, []);

  // ── Bot automation ───────────────────────────────────────────
  useEffect(() => {
    clearTimeout(botTimeout.current);

    // Don't let bots act while a completed trick is being shown
    if (pendingTrick) return;

    if (state.phase === PHASES.BIDDING && state.biddingTurn !== null && state.biddingTurn !== 0) {
      const botId = state.biddingTurn;
      botTimeout.current = setTimeout(() => {
        const decision = botDecideBid(state, botId);
        setState(s => {
          if (s.biddingTurn !== botId) return s;
          if (decision.type === "pass") {
            return applyAction(s, { type: ACTIONS.PASS_BID, playerId: botId });
          }
          return applyAction(s, { type: ACTIONS.PLACE_BID, playerId: botId, amount: decision.amount });
        });
      }, BOT_DELAY);
    }

    if (state.phase === PHASES.TRUMP_PICK && state.trumpCaller !== 0) {
      botTimeout.current = setTimeout(() => {
        setState(s => {
          if (s.phase !== PHASES.TRUMP_PICK) return s;
          const botHand = s.players[s.trumpCaller].hand;
          const allPotential = [...botHand, ...s.remainingCards.filter((_, i) =>
            i % s.playerCount === s.trumpCaller
          )];
          const suit = botPickTrump(allPotential.length ? allPotential : botHand);
          return applyAction(s, { type: ACTIONS.PICK_TRUMP, suit });
        });
      }, BOT_DELAY);
    }

    if (state.phase === PHASES.PLAYING && state.currentTurn !== null && state.currentTurn !== 0) {
      const botId = state.currentTurn;
      botTimeout.current = setTimeout(() => {
        setState(s => {
          if (s.currentTurn !== botId || s.phase !== PHASES.PLAYING) return s;
          const card = botDecideCard(s, botId);
          submitCard(botId, card);
          return s; // submitCard handles its own setState
        });
      }, BOT_DELAY);
    }

    return () => clearTimeout(botTimeout.current);
  }, [state, pendingTrick, submitCard]);

  useEffect(() => () => clearTimeout(clearTimeout_.current), []);

  // ── Derived helpers for UI ────────────────────────────────────
  const humanHand = sortHand(state.players[0]?.hand ?? [], state.trumpSuit);
  const legalMoves = state.phase === PHASES.PLAYING
    ? getLegalMoves(state, 0).map(c => c.id)
    : [];

  const isHumanTurn       = state.phase === PHASES.PLAYING && state.currentTurn === 0 && !pendingTrick;
  const isHumanBidTurn    = state.phase === PHASES.BIDDING && state.biddingTurn === 0;
  const isHumanTrumpPick  = state.phase === PHASES.TRUMP_PICK && state.trumpCaller === 0;

  // What to actually show in the trick area — the frozen completed trick takes priority
  const displayTrick = pendingTrick ?? state.currentTrick;

  return {
    state,
    displayTrick,
    humanHand,
    legalMoves,
    isHumanTurn,
    isHumanBidTurn,
    isHumanTrumpPick,
    actions: { placeBid, passBid, setDouble, pickTrump, playCard, nextRound, resetGame, acknowledgeCancel, claimRound },
  };
}

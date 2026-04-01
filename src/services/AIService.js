import env from "../configs/env";

const DEFAULT_MOCK_LATENCY_MS = 220;
const DEFAULT_ANON_LIMIT = 20;
const DEFAULT_ANON_WINDOW_MS = 24 * 60 * 60 * 1000;
const ANON_MODE_STORAGE_KEY = "ai_anonymous_mode_state_v1";
const CONVERSATION_STORAGE_KEY = "ai_anonymous_conversation_v1";
const DEFAULT_LIVE_TIMEOUT_MS = 20000;
const DEFAULT_LIVE_ENDPOINT = "http://localhost:8506/bai/ai/chat";

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function safeParse(rawValue, fallbackValue) {
  try {
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
}

export class AIService {
  constructor(options = {}) {
    this.mockLatencyMs = options.mockLatencyMs ?? DEFAULT_MOCK_LATENCY_MS;
    this.anonymousMaxMessages = options.anonymousMaxMessages ?? DEFAULT_ANON_LIMIT;
    this.anonymousWindowMs = options.anonymousWindowMs ?? DEFAULT_ANON_WINDOW_MS;
    this.liveTimeoutMs = options.liveTimeoutMs ?? DEFAULT_LIVE_TIMEOUT_MS;
  }

  storageGet(key, fallbackValue) {
    if (typeof window === "undefined" || !window.localStorage) {
      return fallbackValue;
    }
    return safeParse(window.localStorage.getItem(key), fallbackValue);
  }

  storageSet(key, value) {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  generateSessionId() {
    return `anon-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  createAnonymousDefaultState() {
    const now = Date.now();
    return {
      enabled: true,
      sessionId: this.generateSessionId(),
      windowStartedAt: now,
      windowEndsAt: now + this.anonymousWindowMs,
      usedMessages: 0,
      maxMessages: this.anonymousMaxMessages
    };
  }

  normalizeAnonymousState(state) {
    const baseState = state && typeof state === "object" ? state : this.createAnonymousDefaultState();
    const now = Date.now();
    const limit = Number(baseState.maxMessages || this.anonymousMaxMessages);
    const windowEndsAt = Number(baseState.windowEndsAt || 0);
    const shouldRenew = !windowEndsAt || now > windowEndsAt;

    if (shouldRenew) {
      return this.createAnonymousDefaultState();
    }

    return {
      enabled: true,
      sessionId: baseState.sessionId || this.generateSessionId(),
      windowStartedAt: Number(baseState.windowStartedAt || now),
      windowEndsAt,
      usedMessages: Math.max(0, Number(baseState.usedMessages || 0)),
      maxMessages: limit
    };
  }

  getAnonymousState() {
    const stateFromStorage = this.storageGet(ANON_MODE_STORAGE_KEY, null);
    const normalized = this.normalizeAnonymousState(stateFromStorage);
    this.storageSet(ANON_MODE_STORAGE_KEY, normalized);
    return normalized;
  }

  getAnonymousModeStatus() {
    const state = this.getAnonymousState();
    const remainingMessages = Math.max(0, state.maxMessages - state.usedMessages);
    return {
      ...state,
      remainingMessages,
      isLimitReached: remainingMessages <= 0
    };
  }

  consumeAnonymousMessageQuota() {
    const state = this.getAnonymousState();
    if (state.usedMessages >= state.maxMessages) {
      return {
        allowed: false,
        status: this.getAnonymousModeStatus()
      };
    }

    const nextState = {
      ...state,
      usedMessages: state.usedMessages + 1
    };
    this.storageSet(ANON_MODE_STORAGE_KEY, nextState);

    return {
      allowed: true,
      status: this.getAnonymousModeStatus()
    };
  }

  normalizePrompt(input = "") {
    return String(input).replace(/\s+/g, " ").trim();
  }

  createMessage(role, text, createdAt = Date.now()) {
    return {
      id: `${role}-${createdAt}-${Math.floor(Math.random() * 1000)}`,
      role,
      text,
      createdAt
    };
  }

  getInitialMessages(isReset = false, options = {}) {
    const anonymousMode = options.anonymousMode ?? true;
    const useLiveAI = options.useLiveAI ?? false;
    const status = this.getAnonymousModeStatus();

    let baseText = "";
    if (isReset) {
      baseText = useLiveAI ? "Novi GPT chat je pokrenut." : "Novi chat je pokrenut.";
    } else if (useLiveAI) {
      baseText = "Zdravo. Povezan sam na GPT preko BAI backenda. Posalji zahtev.";
    } else {
      baseText = "Zdravo. Posalji zahtev i dobices smislen odgovor pripremljen za lokalni LLM.";
    }

    const anonymousSuffix = anonymousMode && !useLiveAI
      ? ` Anonymous test mode je aktivan (${status.usedMessages}/${status.maxMessages}).`
      : "";

    return [
      this.createMessage("assistant", `${baseText}${anonymousSuffix}`)
    ];
  }

  buildLocalLLMPayload(prompt, safeMode, conversation = []) {
    return {
      target: "local-llm",
      mode: safeMode ? "secure-local" : "local",
      systemPrompt:
        "Ti si bezbedni lokalni AI asistent. Razumi korisnicki zahtev i vrati strukturisan odgovor koji lokalni LLM lako interpretira.",
      instruction:
        "1) Prepoznaj nameru korisnika. 2) Ako je tekstualni zahtev, vrati kratak koristan odgovor. 3) Ako implicira akciju, vrati predlog sledece akcije.",
      outputFormat: {
        intent: "string",
        summary: "string",
        responseType: "text|action",
        response: "string",
        nextAction: "string|null"
      },
      prompt,
      conversation
    };
  }

  generateMockResponse(prompt, conversation = []) {
    const lowered = prompt.toLowerCase();
    const previousUserMessage = [...conversation]
      .reverse()
      .find((msg) => msg.role === "user" && msg.content !== prompt);

    if (lowered.includes("zdravo") || lowered.includes("cao") || lowered.includes("hello")) {
      return "Tu sam. Postavi konkretan zahtev i vraticu ti jasan odgovor ili plan koraka za implementaciju.";
    }
    if (lowered.includes("ko si") || lowered.includes("sta si")) {
      return "Ja sam AI asistent u anonymous test modu. Trenutno radim nad mock logikom bez poziva spoljnog API-ja.";
    }
    if (lowered.includes("pomoc") || lowered.includes("help")) {
      return "Mogu da pomognem oko debug-a, UI izmena, planiranja backend integracije i optimizacije performansi. Napiši cilj u jednoj rečenici.";
    }

    if (lowered.includes("gresk") || lowered.includes("error") || lowered.includes("bug")) {
      return "Prepoznat je zahtev za dijagnostiku problema. Predlog: reprodukcija, izolacija uzroka, minimalna izmena i verifikacija kroz build/test.";
    }
    if (lowered.includes("ui") || lowered.includes("css") || lowered.includes("dizajn")) {
      return "Prepoznat je UI zahtev. Predlog: zadrzati postojeci vizuelni jezik, uraditi ciljanu korekciju spacing/typography/colors i proveriti responsive.";
    }
    if (lowered.includes("api") || lowered.includes("backend") || lowered.includes("endpoint")) {
      return "Prepoznat je integracioni zahtev. Predlog: definisati ulaz/izlaz, timeout i fallback strategiju, zatim validirati kroz edge-case scenarije.";
    }
    if (lowered.includes("performanse") || lowered.includes("brzina") || lowered.includes("optimiz")) {
      return "Prepoznat je zahtev za performanse. Predlog: izmeriti baseline, optimizovati usko grlo, pa uporediti pre/posle merenja.";
    }
    if (lowered.includes("akcija") || lowered.includes("uradi")) {
      return "Prepoznata je akciona namera. Sledece: 1) potvrdi cilj 2) definisi ulazne podatke 3) izvrsi korak po korak uz proveru rezultata.";
    }

    if (previousUserMessage?.content) {
      return `Razumem nastavak teme: "${previousUserMessage.content}". Predlog: preciziraj izlaz koji očekuješ (kod, plan ili listu koraka) i nastavljamo odmah.`;
    }

    return "Zahtev je prihvacen i preformulisan za lokalni LLM. Sledeci korak: razbiti zadatak na manje korake i izvrsiti ih redom uz kratku verifikaciju po koraku.";
  }

  getRateLimitReachedMessage() {
    const status = this.getAnonymousModeStatus();
    return `Dostigli ste limit od ${status.maxMessages} poruka za anonymous test mode. Pokusaj ponovo nakon isteka limita.`;
  }

  getLiveEndpoint() {
    return env?.AI_PROXY_URL || DEFAULT_LIVE_ENDPOINT;
  }

  getLiveSystemPrompt(safeMode = true) {
    if (safeMode) {
      return "Ti si bezbedni AI asistent. Odgovaraj jasno, kratko i korisno. Ne izmisljaj cinjenice i naglasi kada nesto ne mozes da potvrdis.";
    }
    return "Ti si AI asistent za razvoj softvera. Daj prakticne korake i konkretne predloge.";
  }

  extractLiveResponseText(responseData) {
    if (!responseData) {
      return "";
    }

    if (typeof responseData === "string") {
      return responseData;
    }
    if (typeof responseData.reply === "string") {
      return responseData.reply;
    }
    if (typeof responseData.message === "string") {
      return responseData.message;
    }
    if (typeof responseData.output === "string") {
      return responseData.output;
    }
    if (typeof responseData.text === "string") {
      return responseData.text;
    }

    const choices = responseData.choices;
    if (Array.isArray(choices) && choices.length > 0) {
      const firstChoice = choices[0];
      const choiceText =
        firstChoice?.message?.content ||
        firstChoice?.delta?.content ||
        firstChoice?.text ||
        "";
      if (typeof choiceText === "string") {
        return choiceText;
      }
    }

    return "";
  }

  async sendPromptToLiveAI({ normalizedPrompt, safeMode, conversation = [] }) {
    const endpoint = this.getLiveEndpoint();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.liveTimeoutMs);
    const sessionId = this.getAnonymousModeStatus().sessionId;

    const requestBody = {
      sessionId,
      safeMode,
      prompt: normalizedPrompt,
      messages: conversation
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      const data = await response.json();
      if (!response.ok) {
        const errorText =
          data?.message ||
          data?.error ||
          `Live AI endpoint error: ${response.status}`;
        throw new Error(errorText);
      }
      const liveText = this.extractLiveResponseText(data).trim();

      if (!liveText) {
        throw new Error("Live AI endpoint returned empty response.");
      }

      return {
        ok: true,
        provider: "live",
        responseText: liveText,
        raw: data
      };
    } catch (error) {
      return {
        ok: false,
        provider: "live-error",
        error
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async sendPrompt({
    prompt,
    safeMode = true,
    messages = [],
    anonymousMode = true,
    useLiveAI = true,
    fallbackToLocal = true
  }) {
    const normalizedPrompt = this.normalizePrompt(prompt);
    if (!normalizedPrompt) {
      return null;
    }

    if (anonymousMode && !useLiveAI) {
      const quotaResult = this.consumeAnonymousMessageQuota();
      if (!quotaResult.allowed) {
        return {
          limited: true,
          status: quotaResult.status,
          limitMessage: this.getRateLimitReachedMessage()
        };
      }
    }

    const userMessage = this.createMessage("user", normalizedPrompt);
    const conversationForPayload = [...messages, userMessage].map((msg) => ({
      role: msg.role,
      content: msg.text
    }));

    const payload = this.buildLocalLLMPayload(
      normalizedPrompt,
      safeMode,
      conversationForPayload
    );
    let responseText = "";
    let provider = "mock";
    let liveError = null;

    if (useLiveAI) {
      const liveResult = await this.sendPromptToLiveAI({
        normalizedPrompt,
        safeMode,
        conversation: conversationForPayload
      });

      if (liveResult.ok) {
        responseText = liveResult.responseText;
        provider = liveResult.provider;
      } else if (fallbackToLocal) {
        liveError = liveResult.error;
        responseText = this.generateMockResponse(normalizedPrompt, conversationForPayload);
        provider = "local-fallback";
      } else {
        liveError = liveResult.error;
        responseText =
          liveResult.error?.message ||
          "AI backend nije dostupan ili nije vratio ispravan odgovor.";
        provider = "live-error";
      }
    } else {
      responseText = this.generateMockResponse(normalizedPrompt, conversationForPayload);
      provider = "mock";
    }

    const assistantMessage = this.createMessage("assistant", responseText, Date.now() + 1);

    await delay(this.mockLatencyMs);

    return {
      limited: false,
      normalizedPrompt,
      payload,
      responseText,
      userMessage,
      assistantMessage,
      provider,
      liveError,
      status: this.getAnonymousModeStatus()
    };
  }

  async transcribeVoiceInput() {
    return {
      implemented: false,
      text: "",
      source: "mock"
    };
  }

  getConversationHistory() {
    return this.storageGet(CONVERSATION_STORAGE_KEY, []);
  }

  saveConversation(messages = []) {
    this.storageSet(CONVERSATION_STORAGE_KEY, messages);
    return {
      implemented: true,
      saved: true
    };
  }

  startNewChat(options = {}) {
    const anonymousMode = options.anonymousMode ?? true;
    const useLiveAI = options.useLiveAI ?? false;

    if (anonymousMode && !useLiveAI) {
      const currentState = this.getAnonymousState();
      this.storageSet(ANON_MODE_STORAGE_KEY, {
        ...currentState,
        sessionId: this.generateSessionId()
      });
    }

    const initialMessages = this.getInitialMessages(true, { anonymousMode, useLiveAI });
    this.saveConversation(initialMessages);
    return initialMessages;
  }

  async executeAction() {
    return {
      implemented: false,
      executed: false
    };
  }

  async fetchDomainData() {
    return {
      implemented: false,
      data: null
    };
  }
}

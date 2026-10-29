import { Message, UserSettings, Persona } from '../types/chat';

export const PERSONAS: Record<string, Persona> = {
  'coding-mentor': {
    id: 'coding-mentor',
    title: 'Senior Full-Stack Mentor',
    subtitle: 'MERN, Angular & GenAI Engineering',
    description: 'Expert guidance on full-stack architecture, clean code patterns, performance, and real-world debugging.',
    systemPrompt: `You are Deep Purohit's Senior Full-Stack Mentor & AI Engineering Collaborator.
- Explain technical concepts clearly, precisely, and with architectural justification (the WHY, not just the WHAT).
- Always deliver complete, production-ready code with no placeholders or unhandled TODOs.
- Specialize in React 18+, Node.js, Express, MongoDB, Angular 17+ Signals, and Google Gemini API integration.
- Format code cleanly with language identifiers.`,
    badge: 'Code Mentor'
  },
  'systems-architect': {
    id: 'systems-architect',
    title: 'AI & Systems Architect',
    subtitle: 'Distributed Systems & GenAI Pipelines',
    description: 'Scalable microservices, database indexing, caching strategies, and LLM inference orchestration.',
    systemPrompt: `You are an elite Principal Cloud & AI Systems Architect.
- Design resilient, low-latency architectures with clear trade-off analysis.
- Guide database schema design, indexing strategies, rate limiting, and SSE/WebSocket streaming.
- Prioritize high throughput, zero downtime, and strict security posture.`,
    badge: 'Systems Architect'
  },
  'career-strategist': {
    id: 'career-strategist',
    title: 'Engineering Career Strategist',
    subtitle: 'Technical Interviews & Portfolio Polish',
    description: 'FAANG-level mock technical interviews, system design deep-dives, and resume impact framing.',
    systemPrompt: `You are an elite engineering hiring manager and career strategist.
- Conduct rigorous, realistic technical mock interviews with instant rubric scoring.
- Frame engineering accomplishments with measurable impact (STAR methodology).
- Provide candid, actionable feedback to accelerate career progression.`,
    badge: 'Career Strategist'
  }
};

const OFFLINE_KNOWLEDGE_BASE: Record<string, string> = {
  'angular': `### Angular Signals vs. RxJS Observables

In modern Angular (v17+), **Signals** introduce fine-grained reactivity directly into the framework core, replacing zone.js dirty-checking overhead:

1. **Signals (State & Synchronous Values):**
   - Pure synchronous reactive primitives (\`signal()\`, \`computed()\`, \`effect()\`).
   - Glitch-free execution tree: derived computations only re-evaluate when dependencies change.
   - Ideal for component state, UI flags, and derived view models.

2. **RxJS Observables (Asynchronous Events & Streams):**
   - Asynchronous push-based streams handling time-distributed events (HTTP calls, WebSockets, user inputs).
   - Rich pipeable operators (\`debounceTime\`, \`switchMap\`, \`catchError\`).

\`\`\`typescript
// Modern Angular 17+ Signal Store Pattern
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <div class="p-6 bg-stone-900 border border-white/10 rounded-2xl">
      <h3 class="text-white font-bold">Count: {{ count() }}</h3>
      <p class="text-stone-400 text-xs">Double: {{ doubleCount() }}</p>
      <button (click)="increment()" class="mt-4 px-4 py-2 bg-[#ff331f] text-white rounded-xl">
        Increment
      </button>
    </div>
  \`
})
export class CounterComponent {
  count = signal<number>(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(n => n + 1);
  }
}
\`\`\`

**Rule of Thumb:** Use **Signals** for synchronous state and view updates; use **RxJS** for async streams and event pipelines. Convert seamlessly with \`toSignal()\` and \`toObservable()\`.`,

  'node': `### The Node.js Event Loop Architecture

Node.js executes JavaScript on a single thread using **libuv** for asynchronous I/O multiplexing across 6 distinct phases:

1. **Timers:** Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\`.
2. **Pending Callbacks:** Executes I/O callbacks deferred to the next loop iteration (e.g., TCP errors).
3. **Idle, Prepare:** Internal libuv operations.
4. **Poll (Heart of the Loop):** Retrieves new I/O events; executes I/O callbacks; blocks if no timers are ready.
5. **Check:** Executes callbacks registered with \`setImmediate()\`.
6. **Close Callbacks:** Executes \`socket.on('close', ...)\`.

\`\`\`javascript
// Microtasks vs Macrotasks Execution Order
console.log('1: Synchronous script start');

setTimeout(() => console.log('5: Timers macrotask'), 0);
setImmediate(() => console.log('6: Check macrotask'));

Promise.resolve().then(() => console.log('3: Promise microtask'));
process.nextTick(() => console.log('2: nextTick microtask (highest priority)'));

console.log('4: Synchronous script end');
\`\`\`

**Execution Order:** Synchronous code \`1, 4\` → Microtasks (\`process.nextTick\` \`2\`, \`Promise.then\` \`3\`) → Macrotasks (\`Timers\` \`5\`, \`Check\` \`6\`).`,

  'mern': `### Scalable MERN Stack Architecture Blueprint

To scale a MERN stack application from MVP to 50k+ daily active users:

1. **Modular Layered Backend:**
   - \`controllers/\`: Thin HTTP handlers; extract inputs and invoke services.
   - \`services/\`: Pure business logic; transaction orchestration.
   - \`models/\`: Mongoose schemas with compound indexes and validation.
   - \`middlewares/\`: JWT auth, rate-limiting (\`express-rate-limit\`), error boundary.

2. **Database Performance Guardrails:**
   - Add compound indexes on high-frequency queries (\`user_id + createdAt: -1\`).
   - Use lean queries (\`.lean()\`) when write operations are not required to bypass Mongoose hydration overhead.
   - Implement cursor-based pagination over offset/limit to prevent \`O(N)\` scan degradation.

3. **Frontend State & Caching:**
   - React Query / TanStack Query for server state caching and optimistic UI updates.
   - Decouple layout chrome from dynamic page widgets to eliminate re-render cascades.`,

  'debounce': `### Production TypeScript Debounce Utility

Here is a strictly typed debounce implementation with immediate execution and cancel capabilities:

\`\`\`typescript
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number,
  immediate: boolean = false
): { (...args: Parameters<T>): void; cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: any, ...args: Parameters<T>) {
    const callNow = immediate && !timeoutId;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }, waitMs);

    if (callNow) {
      func.apply(this, args);
    }
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}
\`\`\``
};

export class GeminiService {
  private static BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

  static async streamChat(
    messages: Message[],
    settings: UserSettings,
    onChunk: (chunkText: string) => void,
    signal?: AbortSignal
  ): Promise<string> {
    const apiKey = settings.apiKey?.trim();
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content.toLowerCase() || '';

    // If API key is omitted, stream authentic offline architectural mentorship
    if (!apiKey) {
      let chosenResponse = '';
      if (lastUserMessage.includes('angular') || lastUserMessage.includes('signal') || lastUserMessage.includes('rxjs')) {
        chosenResponse = OFFLINE_KNOWLEDGE_BASE['angular'];
      } else if (lastUserMessage.includes('node') || lastUserMessage.includes('event loop')) {
        chosenResponse = OFFLINE_KNOWLEDGE_BASE['node'];
      } else if (lastUserMessage.includes('mern') || lastUserMessage.includes('architecture') || lastUserMessage.includes('scale')) {
        chosenResponse = OFFLINE_KNOWLEDGE_BASE['mern'];
      } else if (lastUserMessage.includes('debounce') || lastUserMessage.includes('typescript')) {
        chosenResponse = OFFLINE_KNOWLEDGE_BASE['debounce'];
      } else {
        chosenResponse = `### Gemini AI Workspace • Ready

Hello Deep! I am operating in **Full-Stack Mentorship Mode** powered by Google Gemini architecture.

To connect live to Google's Gemini 2.5 Flash API:
1. Open **Settings (⚙️)** in the top navigation bar.
2. Enter your Google AI Studio API key (free from [aistudio.google.com](https://aistudio.google.com/)).
3. Enjoy ultra-low-latency real-time streaming tokens.

*Offline Quick Prompts:* Try asking about **Angular Signals**, **Node Event Loop**, **MERN Architecture**, or **TypeScript Debounce** for instant deep-dive demonstrations!`;
      }

      const words = chosenResponse.split(' ');
      let streamed = '';
      for (const word of words) {
        if (signal?.aborted) break;
        const piece = word + ' ';
        streamed += piece;
        onChunk(piece);
        await new Promise((r) => setTimeout(r, 18));
      }
      return streamed;
    }

    const model = settings.model || 'gemini-2.5-flash';
    const persona = PERSONAS[settings.persona] || PERSONAS['coding-mentor'];

    const contents = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const payload = {
      contents,
      systemInstruction: {
        parts: [{ text: persona.systemPrompt }]
      },
      generationConfig: {
        temperature: settings.temperature ?? 0.7,
        maxOutputTokens: settings.maxTokens ?? 2048,
      }
    };

    const endpoint = `${this.BASE_URL}/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const message = errorJson.error?.message || `Gemini API returned status ${response.status}`;
      throw new Error(message);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response stream is unavailable.');

    const decoder = new TextDecoder('utf-8');
    let accumulatedText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (textChunk) {
              accumulatedText += textChunk;
              onChunk(textChunk);
            }
          } catch {
            // Buffer chunk
          }
        }
      }
    }

    return accumulatedText;
  }
}

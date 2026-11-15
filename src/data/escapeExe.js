import source from './escapeExeCode.json';

const paragraph = (text) => ({ type: 'paragraph', text });
const code = (key, title) => ({
  type: 'code',
  caption: `${title} · ${source[key].source.replace('Assets/Script/', '')}:${source[key].startLine}–${source[key].endLine}`,
  language: 'C#',
  code: source[key].code,
});
const diagram = (name, label, caption) => ({ type: 'escape-diagram', diagram: name, label, caption });
const bookNote = (text) => paragraph(`**Design reference:** ${text}`);

const programmingArchitecture = [
  {
    id: 'scenes', title: 'Scene Transitions & Shared Systems',
    blocks: [
      paragraph('I separated persistent services from room scenes. TransitionManager fades between rooms, unloads the previous scene, and loads the next additively; scene-boundary events let other systems record and restore their own state.'),
      diagram('architecture', 'Shared managers stay in the persistent scene while room scenes load and unload.', 'The room changes; inventory, progress, and shared services remain available.'),
      paragraph('**Architecture decision:** Each manager owns one responsibility. A generic singleton base provides shared access, while the additive scene setup keeps those services alive.'),
      code('singleton', 'Shared instance access'),
      bookNote('Separation of responsibilities and KISS guided the split (pp. 6–8). Singleton access keeps the jam framework simple, with the dependency and testing tradeoffs discussed on pp. 58–59.'),
    ],
  },
  {
    id: 'inventory', title: 'Inventory, Selection & UI',
    blocks: [
      paragraph('Clicking a collectible adds it to the inventory and hides its scene object. InventoryManager owns the item list and selected index; item details come from a ScriptableObject data list.'),
      { type: 'list', items: [
        '**Selection:** Left and right buttons request an index offset. The manager wraps around the list and announces the selected item through UpdateUIEvent.',
        '**Display and use:** InventoryUI updates the slot and disables cycling when fewer than two items remain. Successful use removes an item and refreshes the selection; the cursor clears its held-item display.',
      ] },
      diagram('events', 'Successful item use notifies inventory and cursor separately; inventory then refreshes the UI.', 'Inventory owns the data change. UI and cursor respond to notifications.'),
      code('itemEvent', 'Typed notification after item use'),
      code('uiLifecycle', 'The UI subscribes only while enabled'),
      code('inventorySave', 'Inventory owns its save data'),
      bookNote('The observer approach separates notifications from responses (pp. 80–86). Paired subscription cleanup keeps listener lifetimes explicit; the UI still queries the manager for item count.'),
    ],
  },
  {
    id: 'interaction', title: 'Object Interaction & Room State',
    blocks: [
      paragraph('Interactive checks the required item and completion flag before running a puzzle-specific reaction. Book, wire, and clock interactions share this flow while overriding the effect.'),
      diagram('interaction', 'A shared validation, reaction, and completion flow with book, wire, and clock subclasses.', 'One reusable interaction flow, with a small extension point for each puzzle.'),
      code('checkItem', 'Shared validation and completion'),
      code('placeBook', 'One puzzle-specific reaction'),
      paragraph('**Returning to a room:** ObjectManager records collectible availability and interaction completion before unload, then restores them after load. Collected items stay hidden; completed interactions retain their isDone flag. Item names and object names serve as the state keys.'),
      bookNote('The overridable action applies the open-closed principle: add a reaction without rewriting the shared flow (pp. 12–14). State ownership stays with ObjectManager rather than the transition coroutine.'),
    ],
  },
  {
    id: 'dialogue', title: 'Dialogue & Gameplay Flow',
    blocks: [
      paragraph('Dialogue triggers and object interactions hand dialogue data to one DialogueManager. It sequences the lines, selects portrait dialogue or captions, and announces when the conversation finishes.'),
      diagram('dialogue', 'Dialogue data enters a shared manager, which publishes pause and resume states around line presentation.', 'Shared sequencing supports both portrait dialogue and captions.'),
      paragraph('**Architecture decision:** Dialogue data, playback sequencing, and presentation have separate roles. Game-state events gate scene transitions and movement in the snake and maze games while dialogue plays; a completion event lets other systems react afterward.'),
    ],
  },
  {
    id: 'progress', title: 'Minigames & Saved Progress',
    blocks: [
      paragraph('Minigames run in their own scenes and report completion or level changes to GameManager. The shared layer records progress and reapplies it when scenes load.'),
      diagram('minigames', 'Minigame controllers report completion and level changes; GameManager stores progress and restores scene state.', 'The shared integration boundary is completion and progress reporting.'),
      paragraph('**Architecture boundary:** MiniGame entries use a shared completion flag and UnityEvent response. Snake and maze level restoration still uses explicit controller-specific handling.'),
      diagram('persistence', 'ISavable collects manager data into a JSON file; scene events separately preserve room state in memory.', 'Room-to-room continuity and disk saves use separate paths.'),
      code('savable', 'A shared save contract'),
      code('collectSave', 'Collect data through the interface'),
      paragraph('SaveLoadManager collects inventory, object state, minigame progress, and the current scene through ISavable. Registration still uses the singleton, and participants share GameSaveData with manager type names as file keys.'),
      bookNote('Small interfaces and depending on abstractions guided the save contract (pp. 21–29). The collector works through ISavable while each manager supplies its own data.'),
    ],
  },
];

export const escapeExeBreakdown = [
  { id: 'design-communication', title: '1. Design & Communication' },
  {
    id: 'programming-architecture',
    title: '2. Programming & Architecture',
    blocks: [
      paragraph('I used Escape.exe as a deliberate exercise in software architecture alongside delivering the game. Drawing on Unity’s **Level Up Your Code with Game Programming Patterns** (2021 LTS edition, © 2022), I practiced separating responsibilities, extending shared interaction logic, and connecting systems through events and interfaces.'),
      paragraph('The breakdown follows the gameplay systems, from changing rooms and collecting items to dialogue, minigames, and saved progress. Code excerpts retain the project implementation; only indentation is normalized.'),
    ],
    children: programmingArchitecture,
  },
  { id: 'feedback-revisions', title: '3. Feedback & Revisions' },
];

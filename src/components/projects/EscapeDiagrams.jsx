import { createElement } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Boxes, Cable, Check, Clock3, Database, FileJson, Layers, MousePointer2, Package, Puzzle, Radio, Save, ScreenShare } from 'lucide-react';
import './escapeDiagrams.css';

function Node({ icon, title, detail, accent = false }) {
  return <div className={`escape-node${accent ? ' escape-node-accent' : ''}`}>
    {createElement(icon, { size: 22, strokeWidth: 1.6, 'aria-hidden': true })}
    <div><strong>{title}</strong>{detail && <span>{detail}</span>}</div>
  </div>;
}

function Arrow({ label }) {
  return <div className="escape-arrow" aria-hidden="true"><ArrowRight size={22} />{label && <span>{label}</span>}</div>;
}

function Down({ label }) {
  return <div className="escape-down"><ArrowDown size={20} aria-hidden="true" />{label && <span>{label}</span>}</div>;
}

function Architecture() {
  return <>
    <div className="escape-layer">
      <p className="escape-diagram-label"><Layers size={16} aria-hidden="true" /> PERSISTENT SCENE <span>Stays loaded</span></p>
      <div className="escape-node-grid">
        <Node icon={Package} title="Inventory + UI" detail="Items and selection" />
        <Node icon={Boxes} title="ObjectManager" detail="Room object state" />
        <Node icon={ScreenShare} title="TransitionManager" detail="Scene lifecycle" />
        <Node icon={Save} title="SaveLoadManager" detail="Save / restore" />
      </div>
    </div>
    <Down label="Load / unload room scenes additively" />
    <div className="escape-layer escape-layer-rooms">
      <p className="escape-diagram-label"><Puzzle size={16} aria-hidden="true" /> ROOM SCENES <span>Change with exploration</span></p>
      <div className="escape-node-grid escape-node-grid-three">
        <Node icon={MousePointer2} title="Clickable objects" detail="Item requirements" />
        <Node icon={Puzzle} title="Puzzle reactions" detail="Local effects" />
        <Node icon={Layers} title="Minigame scenes" detail="Individual challenges" />
      </div>
    </div>
  </>;
}

function Interaction() {
  return <>
    <p className="escape-diagram-label">SHARED FLOW <span>Interactive.CheckItem</span></p>
    <div className="escape-chain">
      <Node icon={Check} title="Validate" detail="Required item + not done" />
      <Arrow />
      <Node icon={Puzzle} title="Apply reaction" detail="OnClickAction()" accent />
      <Arrow />
      <Node icon={Radio} title="Finish" detail="Dialogue + item-used event" />
    </div>
    <Down label="The matching subclass supplies this action" />
    <div className="escape-branches">
      <Node icon={BookOpen} title="PlaceBook" detail="Reveal the book" />
      <Node icon={Cable} title="Wire" detail="Repair + unlock access" />
      <Node icon={Clock3} title="Clock" detail="Show the clock hand" />
    </div>
  </>;
}

function Events() {
  return <>
    <div className="escape-event-publish">
      <Node icon={Puzzle} title="Interactive" detail="Successful item use" />
      <Arrow label="publishes" />
      <Node icon={Radio} title="ItemUsedEvent" detail="EventHandler · Action<ItemName>" accent />
    </div>
    <Down label="One notification · independent listeners" />
    <div className="escape-event-branches">
      <div>
        <Node icon={Package} title="InventoryManager" detail="Remove item + adjust selection" />
        <Down label="UpdateUIEvent" />
        <Node icon={ScreenShare} title="InventoryUI" detail="Refresh slot + buttons" />
      </div>
      <div>
        <Node icon={MousePointer2} title="CursorManager" detail="Clear the held-item display" />
        <p className="escape-diagram-note">Each listener owns its response.</p>
      </div>
    </div>
  </>;
}

function Persistence() {
  return <>
    <p className="escape-diagram-label">SAVE TO DISK</p>
    <div className="escape-save-sources"><span>Inventory</span><span>Room objects</span><span>Collections</span><span>Game progress</span><span>Current scene</span></div>
    <Down label="Each manager implements ISavable" />
    <div className="escape-chain">
      <Node icon={Boxes} title="GenerateSaveData()" detail="Manager-owned data" />
      <Arrow />
      <Node icon={Database} title="SaveLoadManager" detail="Collect + serialize" accent />
      <Arrow />
      <Node icon={FileJson} title="JSON save file" detail="Persistent data path" />
    </div>
    <div className="escape-room-cycle">
      <p className="escape-diagram-label">BETWEEN ROOMS <span>In memory</span></p>
      <div className="escape-chain">
        <Node icon={Boxes} title="Record state" detail="BeforeSceneUnloadEvent" />
        <Arrow />
        <Node icon={Layers} title="Change scene" detail="Keep shared managers" />
        <Arrow />
        <Node icon={Puzzle} title="Restore state" detail="AfterSceneLoadEvent" />
      </div>
    </div>
  </>;
}

function Dialogue() {
  return <>
    <p className="escape-diagram-label">DIALOGUE FLOW</p>
    <div className="escape-chain">
      <Node icon={MousePointer2} title="Trigger / interaction" detail="DialogueData_SO" />
      <Arrow />
      <Node icon={BookOpen} title="DialogueManager" detail="Sequence dialogue lines" accent />
      <Arrow />
      <Node icon={ScreenShare} title="DialogueUI / CaptionUI" detail="Present each line" />
    </div>
    <Down label="Game-state notifications coordinate interaction" />
    <div className="escape-node-grid">
      <Node icon={Clock3} title="During dialogue" detail="Publish GameState.Pause" />
      <Node icon={Radio} title="After the last line" detail="Resume + DialogueFinishEvent" />
    </div>
  </>;
}

function Minigames() {
  return <>
    <p className="escape-diagram-label">MINIGAME PROGRESS</p>
    <div className="escape-chain">
      <Node icon={Puzzle} title="Minigame controllers" detail="GamePassEvent / GameLevelChangeEvent" />
      <Arrow />
      <Node icon={Database} title="GameManager" detail="Completion + level dictionaries" accent />
      <Arrow />
      <Node icon={Save} title="ISavable" detail="Capture / restore progress" />
    </div>
    <Down label="AfterSceneLoadEvent reapplies recorded progress" />
    <div className="escape-node-grid">
      <Node icon={Check} title="MiniGame entries" detail="Completion flag + UnityEvent response" />
      <Node icon={Layers} title="Snake / maze controllers" detail="Explicit level restoration" />
    </div>
  </>;
}

const diagrams = { architecture: Architecture, interaction: Interaction, events: Events, persistence: Persistence, dialogue: Dialogue, minigames: Minigames };

export function EscapeDiagram({ block }) {
  const Diagram = diagrams[block.diagram];
  return <figure className="escape-diagram" aria-label={block.label}>
    <div className="escape-diagram-canvas"><Diagram /></div>
    <figcaption>{block.caption}</figcaption>
  </figure>;
}

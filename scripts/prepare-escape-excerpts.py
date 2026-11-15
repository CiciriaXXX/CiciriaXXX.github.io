"""Extract portfolio excerpts without rewriting the original Unity implementation."""
import argparse
import hashlib
import json
from pathlib import Path
import textwrap

parser = argparse.ArgumentParser()
parser.add_argument('source_root', type=Path, help='Unity project directory containing Assets')
args = parser.parse_args()
root = args.source_root / 'Assets' / 'Script'


def extract(key, file, start, end):
    path = root / file
    source = path.read_text(encoding='utf-8-sig')
    first = source.index(start)
    last = source.index(end, first) if end else len(source)
    excerpt = source[first:last].rstrip()
    # Restore the indentation preceding the start marker before dedenting.
    prefix = source[source.rfind('\n', 0, first) + 1:first]
    code = textwrap.dedent(prefix + excerpt)
    return key, {
        'source': 'Assets/Script/' + file,
        'startLine': source.count('\n', 0, first) + 1,
        'endLine': source.count('\n', 0, first + len(excerpt)) + 1,
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
        'code': code,
    }


specs = [
    ('checkItem', 'Interactive/Interactive.cs', 'public virtual void CheckItem', '\n        protected virtual'),
    ('placeBook', 'Interactive/PlaceBook.cs', 'protected override void OnClickAction', '\n    }'),
    ('itemEvent', 'Tools/EventHandler.cs', 'public static event Action<ItemName> ItemUsedEvent;', '\n        public static event Action BeforeSceneUnloadEvent;'),
    ('uiLifecycle', 'Inventory/UI/InventoryUI.cs', 'private void OnEnable()', '\n        private void OnUpdateUIEvent'),
    ('savable', 'SaveLoad/ISavable.cs', 'public interface ISavable', '\n}'),
    ('collectSave', 'SaveLoad/SaveLoadManager.cs', '_saveDataDict.Clear();', '\n            \n            //'),
    ('inventorySave', 'Inventory/Logic/InventoryManager.cs', 'public GameSaveData GenerateSaveData()', '\n    }'),
    ('singleton', 'Tools/Singleton.cs', 'public class Singleton<T>', '\n}'),
]
result = dict(extract(*spec) for spec in specs)
output = Path(__file__).resolve().parents[1] / 'src/data/escapeExeCode.json'
output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Extracted {len(result)} source-verified excerpts to {output.name}')

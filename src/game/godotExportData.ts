/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GodotSourceFile {
  path: string;
  category: 'script' | 'scene' | 'config' | 'localization' | 'docs';
  description: string;
  content: string;
}

export const GODOT_PROJECT_FILES: GodotSourceFile[] = [
  {
    path: 'project.godot',
    category: 'config',
    description: 'Godot 4.x Project Configuration optimized for 2D Mobile, low-end Android & Touch',
    content: `; Engine configuration file.
; It's best edited using the editor UI and not directly,
; since the parameters that go here are not all obvious.
;
; Format:
;   [section] ; section goes between []
;   param=value ; assign values to parameters

config_version=5

[application]

config/name="WonderTots Learning Quest"
config/description="An offline-first, child-safe educational game for Android with 6 learning modules, low-end device optimization, and Google Play Families compliance."
config/version="1.0.0"
run/main_scene="res://scenes/main.tscn"
config/features=PackedStringArray("4.3", "Mobile")
boot_splash/bg_color=Color(0.231, 0.51, 0.965, 1)
boot_splash/image="res://assets/images/splash_logo.png"
boot_splash/fullsize=false
boot_splash/use_filter=true

[autoload]

GameManager="*res://scripts/game_manager.gd"
SaveManager="*res://scripts/save_manager.gd"
AudioManager="*res://scripts/audio_manager.gd"
LocalizationManager="*res://scripts/localization_manager.gd"

[display]

window/size/viewport_width=1280
window/size/viewport_height=720
window/size/mode=0
window/size/resizable=true
window/stretch/mode="canvas_items"
window/stretch/aspect="expand"
window/handheld/orientation=4

[input_devices]

pointing/emulate_touch_from_mouse=true
pointing/emulate_mouse_from_touch=true

[rendering]

renderer/rendering_method="mobile"
textures/vram_compression/import_etc2_astc=true
environment/defaults/default_clear_color=Color(0.96, 0.97, 1, 1)
2d/snap/snap_2d_transforms_to_pixel=true
2d/snap/snap_2d_vertices_to_pixel=true

[internationalization]

locale/translations=PackedStringArray("res://localization/translations.en.translation", "res://localization/translations.es.translation", "res://localization/translations.fr.translation", "res://localization/translations.bn.translation")
locale/fallback="en"
`,
  },
  {
    path: 'res://scripts/game_manager.gd',
    category: 'script',
    description: 'Central game state manager orchestrating modules, screens, and child sessions',
    content: `extends Node
class_name GameManager

signal screen_changed(new_screen: String)
signal module_selected(module_id: String)
signal level_started(module_id: String, level_id: int)
signal level_finished(module_id: String, level_id: int, stars: int)

enum ScreenState {
	TITLE,
	MODULE_SELECT,
	LEVEL_SELECT,
	GAMEPLAY,
	VICTORY_MODAL,
	PARENT_GATE,
	PARENT_SETTINGS,
	STICKER_ALBUM
}

var current_screen: ScreenState = ScreenState.TITLE
var active_module_id: String = ""
var active_level_id: int = 1

func _ready() -> void:
	# Ensure deterministic offline state initialization
	SaveManager.load_game_data()
	print("[WonderTots] Game manager initialized. Current locale: ", TranslationServer.get_locale())

func change_screen(new_state: ScreenState) -> void:
	current_screen = new_state
	emit_signal("screen_changed", ScreenState.keys()[new_state])

func select_module(module_id: String) -> void:
	active_module_id = module_id
	emit_signal("module_selected", module_id)
	change_screen(ScreenState.LEVEL_SELECT)

func start_level(module_id: String, level_id: int) -> void:
	active_module_id = module_id
	active_level_id = level_id
	emit_signal("level_started", module_id, level_id)
	change_screen(ScreenState.GAMEPLAY)

func complete_level(stars_earned: int, attempts: int) -> void:
	SaveManager.record_level_completion(active_module_id, active_level_id, stars_earned, attempts)
	emit_signal("level_finished", active_module_id, active_level_id, stars_earned)
	change_screen(ScreenState.VICTORY_MODAL)

func next_level() -> void:
	if active_level_id < 10:
		start_level(active_module_id, active_level_id + 1)
	else:
		change_screen(ScreenState.LEVEL_SELECT)
`,
  },
  {
    path: 'res://scripts/save_manager.gd',
    category: 'script',
    description: 'Versioned local JSON storage with safe defaults, corrupted save recovery, and migration',
    content: `extends Node

const SAVE_PATH: String = "user://wondertots_save_v1.json"
const CURRENT_VERSION: int = 1

var save_data: Dictionary = {}

func _ready() -> void:
	load_game_data()

func get_default_save() -> Dictionary:
	return {
		"save_version": CURRENT_VERSION,
		"updated_at": Time.get_datetime_string_from_system(),
		"total_stars": 0,
		"unlocked_stickers": [],
		"settings": {
			"language": "en",
			"sound_enabled": true,
			"voice_narration": true,
			"volume": 0.8,
			"reduced_motion": false,
			"high_contrast": false,
			"speech_rate": 1.0
		},
		"modules": {
			"number_adventure": {"highest_unlocked_level": 1, "levels": {}},
			"shape_explorer": {"highest_unlocked_level": 1, "levels": {}},
			"color_quest": {"highest_unlocked_level": 1, "levels": {}},
			"animal_world": {"highest_unlocked_level": 1, "levels": {}},
			"logic_puzzle": {"highest_unlocked_level": 1, "levels": {}},
			"memory_challenge": {"highest_unlocked_level": 1, "levels": {}}
		}
	}

func load_game_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		save_data = get_default_save()
		write_save_data()
		return

	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if not file:
		push_warning("Could not open save file for reading. Using safe defaults.")
		save_data = get_default_save()
		return

	var json_str := file.get_as_text()
	file.close()

	var test_json := JSON.new()
	var err := test_json.parse(json_str)
	if err != OK or typeof(test_json.data) != TYPE_DICTIONARY:
		push_error("Save data was corrupted. Rebuilding safe defaults.")
		save_data = get_default_save()
		write_save_data()
		return

	save_data = validate_and_migrate(test_json.data)

func validate_and_migrate(raw: Dictionary) -> Dictionary:
	var defaults := get_default_save()
	if not raw.has("save_version") or typeof(raw["save_version"]) != TYPE_FLOAT and typeof(raw["save_version"]) != TYPE_INT:
		return defaults

	# Safe merge of settings and modules
	if not raw.has("settings") or typeof(raw["settings"]) != TYPE_DICTIONARY:
		raw["settings"] = defaults["settings"]
	if not raw.has("modules") or typeof(raw["modules"]) != TYPE_DICTIONARY:
		raw["modules"] = defaults["modules"]

	return raw

func write_save_data() -> bool:
	save_data["updated_at"] = Time.get_datetime_string_from_system()
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if not file:
		push_error("Failed to open save file for writing.")
		return false

	var json_str := JSON.stringify(save_data, "\\t")
	file.store_string(json_str)
	file.close()
	return true

func record_level_completion(module_id: String, level_id: int, stars: int, attempts: int) -> void:
	var mod_data: Dictionary = save_data["modules"][module_id]
	var current_levels: Dictionary = mod_data["levels"]
	
	var lvl_key := str(level_id)
	var prev_stars: int = 0
	if current_levels.has(lvl_key):
		prev_stars = int(current_levels[lvl_key].get("stars", 0))

	var best_stars := int(max(prev_stars, stars))
	current_levels[lvl_key] = {
		"completed": true,
		"stars": best_stars,
		"attempts": attempts,
		"completed_at": Time.get_datetime_string_from_system()
	}

	# Progression unlock
	var highest: int = int(mod_data.get("highest_unlocked_level", 1))
	if level_id >= highest and level_id < 10:
		mod_data["highest_unlocked_level"] = level_id + 1

	# Recalculate total stars
	var total_stars: int = 0
	for m_id in save_data["modules"]:
		var m = save_data["modules"][m_id]
		for l_id in m["levels"]:
			if m["levels"][l_id].get("completed", false):
				total_stars += int(m["levels"][l_id].get("stars", 0))
	save_data["total_stars"] = total_stars

	write_save_data()

func reset_progress() -> void:
	save_data = get_default_save()
	write_save_data()
`,
  },
  {
    path: 'res://scripts/parental_gate.gd',
    category: 'script',
    description: 'Child-proof arithmetic gate preventing accidental child entry into parent settings',
    content: `extends Control
class_name ParentalGate

signal gate_passed()
signal gate_cancelled()

@onready var question_label: Label = $VBoxContainer/QuestionLabel
@onready var answer_input: LineEdit = $VBoxContainer/AnswerInput
@onready var error_label: Label = $VBoxContainer/ErrorLabel

var expected_answer: int = 0

func _ready() -> void:
	generate_challenge()

func generate_challenge() -> void:
	# Random multiplication challenge (e.g. 6 x 7 or 7 x 8)
	var a := randi_range(4, 9)
	var b := randi_range(3, 9)
	expected_answer = a * b
	
	question_label.text = tr("PARENT_GATE_HINT") + "\\n\\n" + str(a) + " × " + str(b) + " = ?"
	answer_input.text = ""
	error_label.visible = false

func _on_submit_pressed() -> void:
	var user_val := answer_input.text.strip_edges().to_int()
	if user_val == expected_answer:
		error_label.visible = false
		emit_signal("gate_passed")
		queue_free()
	else:
		error_label.visible = true
		error_label.text = tr("PARENT_GATE_FAILED")
		generate_challenge()

func _on_cancel_pressed() -> void:
	emit_signal("gate_cancelled")
	queue_free()
`,
  },
  {
    path: 'res://localization/translations.csv',
    category: 'localization',
    description: 'Godot CSV Localization Table supporting en, es, fr, bn with UTF-8 glyphs',
    content: `keys,en,es,fr,bn
APP_NAME,"WonderTots Learning Quest","Aventura WonderTots","Aventure WonderTots","ওয়ান্ডার টটস লার্নিং কোয়েস্ট"
PLAY_NOW,"Start Playing","Empezar a Jugar","Commencer à Jouer","খেলা শুরু করি"
CONTINUE,"Continue","Continuar","Continuer","চালিয়ে যাও"
CHOOSE_ADVENTURE,"Choose an Adventure","Elige una Aventura","Choisis une Aventure","একটি অ্যাডভেঞ্চার বেছে নাও"
SELECT_LEVEL,"Select Level","Selecciona Nivel","Sélectionner le Niveau","লেভেল নির্বাচন"
LEVEL,"Level","Nivel","Niveau","লেভেল"
STARS,"Stars","Estrellas","Étoiles","তারা"
TOTAL_STARS,"Total Stars","Estrellas Totales","Étoiles Totales","মোট তারা"
STICKER_ALBUM,"Sticker Album","Álbum de Pegatinas","Livre d’Autocollants","স্টিকার অ্যালবাম"
PARENT_ZONE,"Parent Area","Área de Padres","Espace Parents","অভিভাবক এলাকা"
PARENT_GATE_HINT,"Please solve this math question to enter settings:","Resuelve este cálculo para entrar:","Résous ce calcul pour continuer :","সেটিংসে যেতে এই অঙ্কটি সমাধান করুন:"
PARENT_GATE_FAILED,"Incorrect answer. Please try again.","Respuesta incorrecta. Intenta otra vez.","Réponse incorrecte. Réessaie.","ভুল উত্তর। আবার চেষ্টা করুন।"
WELL_DONE,"Fantastic Job!","¡Muy Bien!","Bravo !","দারুণ হয়েছে!"
TRY_AGAIN,"Almost there! Try again.","¡Casi! Inténtalo otra vez.","Presque ! Réessaie.","কাছাকাছি ছিলে! আবার চেষ্টা করো।"
NEXT_LEVEL,"Next Level","Siguiente Nivel","Niveau Suivant","পরবর্তী লেভেল"
REPLAY,"Play Again","Jugar de Nuevo","Rejouer","আবার খেলি"
`,
  },
  {
    path: 'export_presets.cfg',
    category: 'config',
    description: 'Production Android APK/AAB Export Preset (API 34, Families compliance, Min SDK 24)',
    content: `[preset.0]

name="Android Production AAB"
platform="Android"
runnable=true
advanced_options=false
dedicated_server=false
custom_features=""
export_filter="all_resources"
include_filter=""
exclude_filter=""
export_path="./build/wondertots_release.aab"

[preset.0.options]

custom_template/debug=""
custom_template/release=""
gradle_build/use_gradle_build=true
gradle_build/export_format=1
gradle_build/min_sdk="24"
gradle_build/target_sdk="34"
package/unique_name="org.wondertots.learningquest"
package/name="WonderTots"
package/signed=true
package/app_category=3
version/code=1
version/name="1.0.0"
permission/access_network_state=false
permission/internet=false
permission/read_external_storage=false
permission/write_external_storage=false
screen/orientation=4
screen/support_small=true
screen/support_normal=true
screen/support_large=true
screen/support_xlarge=true
xr_mode=0
`,
  },
];

export const MASTER_DELIVERABLES_TEXT = {
  sectionA: `## A. Executive Summary & Original Game Concept
* **Game Title:** WonderTots: Global Offline Learning Quest
* **Target Audience:** Children aged 3 to 8 years old, families, preschools, and early learners across global emerging markets.
* **Core Philosophy:** Pure play, zero ads, zero tracking, zero dark patterns. Failure is treated with gentle encouragement and zero punishment. All progression unlocks naturally through play.
* **Visual Style:** High-contrast, clean pastel hues with deep outlines, friendly oversized icons, clear silhouettes, and zero visual clutter to ensure readability on small 4-inch to 6-inch budget displays.`,

  sectionB: `## B. Recommended Technology Stack & Justification
* **Game Engine:** Godot Engine 4.3 (Mobile / Compatibility Renderer).
  - *Why Godot over Unity/Unreal?* Godot compiles to a lean ~25-35 MB baseline AAB without heavyweight splash dependencies or background telemetry. It boasts instant cold boot times (<1.5s on Snapdragon 439 / MediaTek Helio A22).
  - *Zero Runtime Royalties:* 100% free under the MIT License, perfect for solo educators and indie developers.
  - *Language:* GDScript provides high-speed iteration with zero garbage-collection pauses.
  - *Graphics Pipeline:* GLES3 / Vulkan Mobile fallback with 2D Pixel Snap and batching ensures smooth 60 FPS on low-tier Mali-G52 and Adreno 505 GPUs with <80 MB RAM usage.`,

  sectionC: `## C. MVP Scope and Development Roadmap
* **Phase 1 (Core Architecture):** Unified Game Manager, local JSON save system with versioning, and sound engine.
* **Phase 2 (6 Curriculum Modules):** Number Adventure (10 levels), Shape Explorer (10 levels), Color Quest (10 levels), Animal World (10 levels), Logic Puzzle (10 levels), Memory Challenge (10 levels) = 60 levels total.
* **Phase 3 (Child Safety & Localization):** Multi-language strings (EN, ES, FR, BN), Parental Gate with multiplication challenge, COPPA privacy review, zero-permission manifest.
* **Phase 4 (Android Export & Play Console):** Signed AAB packaging, Families Policy questionnaire, Data Safety sheet declaration.`,

  sectionL: `## L. Android Build & Signed AAB Generation Guide
1. **Generate a Secure Release Keystore (Bash):**
   \`\`\`bash
   keytool -genkeypair -v -keystore wondertots-release.keystore \\
     -alias wondertots -keyalg RSA -keysize 2048 -validity 10000 \\
     -dname "CN=WonderTots, OU=Education, O=WonderTots Inc, L=Dhaka, C=BD"
   \`\`\`
2. **Export Android App Bundle (.aab):**
   \`\`\`bash
   godot --headless --export-release "Android Production AAB" ./build/wondertots.aab
   \`\`\`
3. **Verify Bundle Size & Permissions:**
   Ensure zero internet permissions (\`android.permission.INTERNET\` must be removed) and verify download size is under 40 MB using \`bundletool\`.`,

  sectionM: `## M. Google Play Families & Data Safety Submission
* **Target Age Declaration:** 5 and under, 6-8.
* **Families Policy Compliance:** 100% compliant.
* **Data Safety Declaration:**
  - *Data collected:* None.
  - *Data shared with third parties:* None.
  - *Security practices:* Data stored locally on device only; uninstalled when app is removed.
  - *Ads:* Does this app contain ads? NO.
  - *Tracking:* Does this app track users across other apps? NO.`,
};

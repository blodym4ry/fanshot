/**
 * FanShot Prompt Engine v5
 *
 * Primary mode: SINGLE-IMAGE — only the fan's selfie is supplied.
 * The footballer is described textually using detailed physical descriptions.
 * FLUX Kontext Max knows famous footballers by name; we add physical details
 * to maximize likeness accuracy.
 *
 * Model: fal-ai/flux-pro/kontext/max  (single reference image)
 * Input: { image_url: selfieUrl, prompt: ... }
 *
 * Fallback dual-image mode is preserved for future use (when player photos
 * can be reliably hosted on Supabase Storage).
 *
 * Prompt structure:  CAMERA_PREFIX + SCENE_ACTION + SCENE_DETAILS + PHOTO_STYLE + FACE_PRESERVATION
 */

/* ─── Scene type: selfie vs third-person ──────────────── */

const SELFIE_SCENES = new Set([
  'tunnel_encounter',
  'pitchside_quick',
  'hotel_encounter',
  'airport_arrival',
  'warmup_pitch',
]);

/* ─── Detailed physical descriptions for top players ──── */

const PLAYER_DESCRIPTIONS: Record<string, string> = {
  // ═══ TOP 20 GLOBAL STARS ═══
  'Lionel Messi':
    'Lionel Messi, the legendary Argentine footballer — light-skinned man in his late 30s, short brown hair with slight beard, medium height around 170cm, lean athletic build, calm gentle expression, distinctive tattoo sleeve on right arm',
  'Cristiano Ronaldo':
    'Cristiano Ronaldo, the famous Portuguese footballer — tall athletic man around 187cm, dark gelled-back hair, strong jawline, clean shaven or light stubble, very muscular build, confident charismatic expression',
  'Kylian Mbappé':
    'Kylian Mbappé, the famous French footballer — young Black man, very short dark hair almost buzzed, clean shaven, athletic muscular build, tall around 178cm, sharp jawline, bright energetic smile',
  'Jude Bellingham':
    'Jude Bellingham, the young English footballer — young Black man, short dark curly hair, clean shaven, tall athletic build around 186cm, youthful face, bright confident smile',
  'Erling Haaland':
    'Erling Haaland, the Norwegian footballer — very tall man around 194cm, long blonde hair often tied back, Nordic features, light skin, very large muscular build, intense focused expression',
  'Vinícius Jr':
    'Vinícius Júnior, the Brazilian footballer — young Black man, short dark curly hair, lean athletic build, medium height around 176cm, youthful energetic expression, bright wide smile',
  'Lamine Yamal':
    'Lamine Yamal, the very young Spanish footballer — teenager around 17 years old, dark skin, short dark curly hair, slim athletic teenage build, boyish youthful face, excited expression',
  'Mohamed Salah':
    'Mohamed Salah, the Egyptian footballer — man with distinctive large curly dark afro hair, short neatly trimmed beard, medium athletic build around 175cm, warm genuine smile',
  'Kevin De Bruyne':
    'Kevin De Bruyne, the Belgian footballer — light-skinned man with ginger/reddish-blonde hair, clean shaven, medium height around 181cm, athletic build, focused intense expression with blue eyes',
  'Son Heung-min':
    'Son Heung-min, the South Korean footballer — East Asian man, short black hair neatly styled, clean shaven, medium height around 183cm, athletic build, warm friendly smile, youthful look',
  'Robert Lewandowski':
    'Robert Lewandowski, the Polish footballer — tall athletic man around 185cm, short dark hair neatly styled, clean shaven or light stubble, strong Eastern European facial features, focused determined expression',
  'Neymar':
    'Neymar Jr, the Brazilian footballer — medium height man around 175cm, often styled dark hair or mohawk, light brown skin, lean athletic build, playful confident expression, visible tattoos on arms and neck',
  'Harry Kane':
    'Harry Kane, the English footballer — tall man around 188cm, short light brown hair, clean shaven, strong build, English features, serious determined expression',

  // ═══ TURKISH PLAYERS ═══
  'Hakan Çalhanoğlu':
    'Hakan Çalhanoğlu, the Turkish footballer — dark-haired man with short neatly trimmed dark beard, medium height around 178cm, athletic build, Mediterranean features, serious focused expression, Turkish appearance',
  'Arda Güler':
    'Arda Güler, the very young Turkish footballer — young man around 19 years old, dark brown hair medium length, clean shaven, slim build, Mediterranean Turkish features, youthful eager expression',
  'Kenan Yıldız':
    'Kenan Yıldız, the young Turkish footballer — young man around 19, dark hair, clean shaven, slim athletic build, youthful face, Turkish features, confident expression',

  // ═══ MORE TOP PLAYERS ═══
  'Jamal Musiala':
    'Jamal Musiala, the German footballer — young mixed-race man, curly dark hair, slim athletic build around 183cm, friendly open expression, youthful features',
  'Florian Wirtz':
    'Florian Wirtz, the German footballer — very young man, light brown/reddish hair, fair skin, slim build, boyish German features, focused expression',
  'Bukayo Saka':
    'Bukayo Saka, the English footballer — young Black man, short dark hair, clean shaven, athletic build around 178cm, warm genuine smile, youthful features',
  'Phil Foden':
    'Phil Foden, the English footballer — young man, blonde hair, fair English features, slim athletic build around 171cm, boyish face, confident expression',
  'Rodri':
    'Rodri, the Spanish footballer — tall man around 191cm, short dark hair, short beard, strong build, Spanish features, calm composed expression',
  'Virgil van Dijk':
    'Virgil van Dijk, the Dutch footballer — very tall man around 193cm, short dark curly hair, short beard, imposing muscular build, mixed Dutch-Surinamese features, commanding presence',
  'Luka Modrić':
    'Luka Modrić, the Croatian footballer — medium height man around 172cm, long blonde/light brown hair, slim build, Eastern European features, experienced mature face, calm wise expression',
  'Achraf Hakimi':
    'Achraf Hakimi, the Moroccan footballer — young man, short dark hair, short beard, athletic build around 181cm, North African/Moroccan features, confident smile',
  'Sadio Mané':
    'Sadio Mané, the Senegalese footballer — Black man, short dark hair, athletic lean build around 175cm, warm smile, West African features',
  'Victor Osimhen':
    'Victor Osimhen, the Nigerian footballer — young Black man, short hair, athletic muscular build around 185cm, intense competitive expression, Nigerian features',
  'Federico Valverde':
    'Federico Valverde, the Uruguayan footballer — young man, short dark hair, clean shaven, tall athletic build around 182cm, South American features, determined expression',
  'Darwin Núñez':
    'Darwin Núñez, the Uruguayan footballer — young man, dark curly hair, athletic build around 187cm, Afro-Uruguayan features, passionate intense expression',
  'Luis Díaz':
    'Luis Díaz, the Colombian footballer — young man, dark hair often in braids or dreadlocks, Colombian features, energetic athletic build around 178cm, joyful expression',
  'Alphonso Davies':
    'Alphonso Davies, the Canadian footballer — young Black man, short dark hair, athletic fast build around 183cm, Liberian-Canadian background, bright energetic smile',
  'Moisés Caicedo':
    'Moisés Caicedo, the Ecuadorian footballer — young Black man, short dark hair, athletic build around 178cm, Ecuadorian features, determined focused expression',
  'Christian Pulisic':
    'Christian Pulisic, the American footballer — young man, short brown hair, fair American features, athletic build around 177cm, focused determined expression',
  'Alexander Isak':
    'Alexander Isak, the Swedish footballer — tall young man around 190cm, dark skin, short dark hair, lean athletic build, Swedish-Eritrean background, calm confident expression',
  'Viktor Gyökeres':
    'Viktor Gyökeres, the Swedish footballer — tall athletic man around 187cm, light brown hair with beard, strong Nordic build, intense competitive expression',
  'Granit Xhaka':
    'Granit Xhaka, the Swiss footballer — medium height man around 185cm, short dark hair, short dark beard, strong athletic build, Albanian-Swiss features, commanding presence',
  'Dušan Vlahović':
    'Dušan Vlahović, the Serbian footballer — tall man around 190cm, short dark hair, clean shaven or stubble, strong Serbian features, intense sharp expression',
  'Nicolò Barella':
    'Nicolò Barella, the Italian footballer — medium height man, dark hair, light beard, Italian features, energetic athletic build around 172cm, passionate expression',
  'Bruno Fernandes':
    'Bruno Fernandes, the Portuguese footballer — medium height man around 179cm, dark hair, light beard, Portuguese features, animated passionate expression, energetic presence',
  'Xavi Simons':
    'Xavi Simons, the Dutch footballer — young man, distinctive curly blonde/light hair, athletic build around 179cm, Dutch features, youthful trendy appearance, confident expression',
  'Riyad Mahrez':
    'Riyad Mahrez, the Algerian footballer — medium height man around 179cm, dark curly hair, short beard, North African features, skillful elegant presence, calm expression',
  'Mehdi Taremi':
    'Mehdi Taremi, the Iranian footballer — tall man around 187cm, short dark hair, short dark beard, Persian/Iranian features, strong athletic build, composed expression',
  'Mohammed Kudus':
    'Mohammed Kudus, the Ghanaian footballer — young Black man, short dark hair, athletic build around 177cm, Ghanaian features, exciting energetic expression',
  'Martin Ødegaard':
    'Martin Ødegaard, the Norwegian footballer — young man around 178cm, light brown hair, fair Nordic features, slim athletic build, captain-like composed expression',

  // ═══ GOALKEEPERS & DEFENDERS ═══
  'Alisson':
    'Alisson Becker, the Brazilian goalkeeper — tall man around 191cm, short brown hair, short beard, Brazilian features, calm commanding presence',
  'Thibaut Courtois':
    'Thibaut Courtois, the Belgian goalkeeper — very tall man around 199cm, short dark hair, strong Belgian features, imposing presence',
};

/* ─── Jersey color descriptions by country ────────────── */

const JERSEY_COLORS: Record<string, string> = {
  Argentina: 'light blue and white striped',
  Brazil: 'yellow with green trim',
  France: 'dark blue with red and white trim',
  Germany: 'white with black trim',
  Spain: 'red with navy blue shorts',
  England: 'white with navy blue trim',
  Portugal: 'dark red with green trim',
  Turkey: 'red with white trim',
  Netherlands: 'bright orange with black trim',
  Italy: 'azure blue with white trim',
  Belgium: 'red with black and yellow trim',
  Croatia: 'red and white checkered',
  Uruguay: 'sky blue with white trim',
  Colombia: 'yellow with navy blue trim',
  Mexico: 'dark green with white and red trim',
  Japan: 'dark blue with white trim',
  'South Korea': 'red with black trim',
  Australia: 'gold yellow with green trim',
  USA: 'white with navy blue and red trim',
  Canada: 'red with white trim',
  Morocco: 'red with green trim',
  Senegal: 'white with green trim',
  Ghana: 'white with yellow and black trim',
  Nigeria: 'green with white trim',
  Egypt: 'red with white trim',
  Cameroon: 'green with red and yellow trim',
  'Saudi Arabia': 'white with green trim',
  Iran: 'white with red trim',
  Qatar: 'maroon with white trim',
  Poland: 'white with red trim',
  Denmark: 'red with white trim',
  Sweden: 'yellow with blue trim',
  Norway: 'red with navy blue and white trim',
  Switzerland: 'red with white cross',
  Austria: 'red with white trim',
  Serbia: 'red with white and blue trim',
  Scotland: 'navy blue with white trim',
  Wales: 'red with white trim',
  'Czech Republic': 'red with white and blue trim',
  Ecuador: 'yellow with blue trim',
  Paraguay: 'red and white striped',
  Chile: 'red with blue shorts',
  Peru: 'white with red diagonal sash',
  'Costa Rica': 'red with blue and white trim',
  Panama: 'red with blue and white trim',
  Honduras: 'white with blue trim',
  Jamaica: 'gold and green with black trim',
  'Ivory Coast': 'orange with white and green trim',
  Tunisia: 'red with white trim',
  Algeria: 'white with green trim',
  'South Africa': 'yellow with green trim',
  'DR Congo': 'blue with red and yellow trim',
  Mali: 'yellow with green trim',
  'Burkina Faso': 'green with red trim',
  'New Zealand': 'white with silver fern',
  China: 'red with yellow trim',
  India: 'blue with white trim',
  'Bosnia and Herzegovina': 'blue with white and yellow trim',
};

/* ─── PHOTO_STYLE suffix (appended to every prompt) ──── */

const PHOTO_STYLE =
  'Ultra-realistic smartphone photograph. Real camera sensor noise, natural depth of field, authentic smartphone color grading. Realistic skin with pores, natural under-eye shadows, authentic fabric wrinkles. No extra fingers, perfect human anatomy, natural proportions. This must look identical to a real photo posted on social media — NOT a render, NOT AI art, NOT a professional photoshoot.';

/* ─── Scene templates ─────────────────────────────────── */

interface SceneTemplate {
  /** What is happening in the scene */
  action: string;
  /** Environmental / setting details */
  details: string;
}

/**
 * Placeholders:
 *   [FAN]     = "the person in the reference image" (single-image primary mode)
 *   [PLAYER]  = detailed physical description + name + country (single-image)
 *             OR "the person in the second image (Name)" (dual-image future mode)
 *   [JERSEY]  = country jersey color description
 *   [COUNTRY] = player's country name
 */
const sceneTemplates: Record<string, SceneTemplate> = {
  tunnel_encounter: {
    action:
      '[FAN] takes a quick selfie with [PLAYER] in a stadium tunnel after a FIFA World Cup 2026 match. [PLAYER] is wearing [COUNTRY] national team jersey ([JERSEY]), visibly sweaty with flushed cheeks, has briefly stopped to lean into the fan\'s selfie. [PLAYER] gives a quick polite smile — clearly gracious but in a hurry. [FAN] holds the phone up with one hand, looking excited and slightly nervous.',
    details:
      'Concrete tunnel walls, dim fluorescent overhead lights, other staff and players walking past blurred in background. The selfie captures both faces at close range.',
  },

  pitchside_quick: {
    action:
      '[FAN] has managed a quick selfie with [PLAYER] at the edge of the pitch after a World Cup match. [PLAYER] in [COUNTRY] match jersey ([JERSEY]), grass stains on shorts, sweat glistening on forehead, has leaned over the advertising board barrier for the photo. [FAN] reaches up with the phone from the front row.',
    details:
      'Stadium seats, green pitch, and floodlights creating slight lens flare in background. Excited crowd partially visible. Quick spontaneous moment.',
  },

  mixed_zone: {
    action:
      '[FAN] standing next to [PLAYER] in the mixed zone area after a World Cup 2026 match. [PLAYER] in [COUNTRY] jersey ([JERSEY]) with towel over one shoulder, face still flushed from the match. Standing side by side with a small gap — not touching, just close for the photo. [FAN] smiling broadly. [PLAYER] gives a tired but genuine half-smile.',
    details:
      'Media backdrop with FIFA sponsors partially visible behind them. Harsh fluorescent lighting creating slight shadows. Photo taken from about 2 meters away.',
  },

  training_ground: {
    action:
      '[FAN] posing for a photo with [PLAYER] at a World Cup 2026 training session. [PLAYER] in [COUNTRY] training kit (casual athletic wear in [JERSEY] colors), has walked to the barrier fence to meet fans. Standing side by side on opposite sides of a low fence, [PLAYER] leaning on it casually. [FAN] is beaming.',
    details:
      'Training pitch, cones, and other players stretching visible in the background. Bright outdoor daylight casting natural shadows.',
  },

  hotel_encounter: {
    action:
      '[FAN] has spotted [PLAYER] in a luxury hotel lobby and asked for a quick selfie. [PLAYER] is in casual designer clothing — clean fitted t-shirt, expensive watch visible, relaxed posture. [PLAYER] politely leans slightly toward the camera with a casual smile. [FAN] holds the phone up, looking thrilled and slightly starstruck.',
    details:
      'Elegant hotel lobby with marble floor, modern furniture, warm ambient lighting. Other hotel guests walking past, slightly blurred. A candid lucky encounter.',
  },

  stadium_exit: {
    action:
      '[FAN] next to [PLAYER] outside the stadium after a World Cup 2026 night match. [PLAYER] in [COUNTRY] team tracksuit or post-match jacket ([JERSEY] colors), wearing headphones around neck, about to get on the team bus. Stopped for a brief moment for this photo. Standing close but not touching.',
    details:
      'Night time, stadium exterior lights illuminating them, crowd and team bus in background. [FAN] is grinning. Security personnel partially visible.',
  },

  celebration_moment: {
    action:
      '[FAN] on the pitch with [PLAYER] during post-match celebrations after [COUNTRY] won their World Cup 2026 match. [PLAYER] in [COUNTRY] jersey ([JERSEY]), ecstatic, sweaty, jersey slightly untucked. [FAN] has gotten close during the pitch invasion. [PLAYER] has an arm raised in celebration, [FAN] is euphoric.',
    details:
      'Confetti falling, other celebrating players and fans in the chaotic background. Floodlit stadium, electric atmosphere. Someone in the crowd captured this moment.',
  },

  autograph_line: {
    action:
      '[FAN] at a FIFA fan zone autograph session with [PLAYER]. [PLAYER] sitting behind a table wearing [COUNTRY] team polo or branded casual wear ([JERSEY] colors), pen in hand. [FAN] standing on the other side of the table, leaning forward slightly with a big smile. [PLAYER] looks up at the camera with a practiced warm smile.',
    details:
      'FIFA and sponsor branding visible on the backdrop. Indoor event lighting, queue of other fans visible in the background.',
  },

  warmup_pitch: {
    action:
      '[FAN] taking a selfie from the front row during World Cup 2026 warmup. [PLAYER] in [COUNTRY] warmup bib ([JERSEY] colors) has jogged over to the stands and leaned close to the barrier for a quick photo. [PLAYER] is loose, relaxed, pre-match focused energy, slight smile. [FAN] reaching forward with the phone, excited.',
    details:
      'Nearly empty stadium behind them, pristine green pitch, other players warming up in the distance. Late afternoon golden hour light.',
  },

  airport_arrival: {
    action:
      '[FAN] taking a selfie with [PLAYER] at an airport. [PLAYER] is in smart casual travel clothing — designer jacket, comfortable pants, sunglasses pushed up on head, pulling carry-on luggage. Stopped briefly in the terminal for this fan photo. [PLAYER] gives a quick friendly smile. [FAN] is clearly excited.',
    details:
      'Airport terminal with departure boards, other travelers, bright terminal lighting. A quick lucky airport encounter selfie.',
  },
};

/* ─── Public API ──────────────────────────────────────── */

export interface PlayerPromptData {
  playerName: string;
  playerCountry: string;
  playerNumber: number;
  teamColors: [string, string];
}

/**
 * Get the detailed player description for the prompt.
 * Falls back to a generic description with name + country if no detailed one exists.
 */
function getPlayerDescription(playerName: string, playerCountry: string): string {
  // Check exact match first
  if (PLAYER_DESCRIPTIONS[playerName]) {
    return PLAYER_DESCRIPTIONS[playerName];
  }

  // Fallback: generic description with name + country
  return `${playerName}, the famous ${playerCountry} international footballer`;
}

/**
 * Build the text prompt for FLUX Kontext Max.
 *
 * @param scene           — scene ID (e.g. 'tunnel_encounter')
 * @param player          — player metadata
 * @param hasDualImages   — true when both selfie + player photo are supplied (future use)
 */
export function buildPrompt(
  scene: string,
  player: PlayerPromptData,
  hasDualImages: boolean = false
): string {
  const template = sceneTemplates[scene];
  if (!template) {
    throw new Error(`Unknown scene: ${scene}`);
  }

  const { playerName, playerCountry } = player;

  // Get jersey color description
  const jerseyDesc =
    JERSEY_COLORS[playerCountry] ||
    `${player.teamColors[0]} and ${player.teamColors[1]}`;

  // Fan / Player descriptors depending on mode
  const fanDesc = hasDualImages
    ? 'the person in the first image'
    : 'the person in the reference image';

  const playerDesc = hasDualImages
    ? `the person in the second image (${playerName})`
    : getPlayerDescription(playerName, playerCountry);

  // Select camera style prefix
  const cameraPrefix = SELFIE_SCENES.has(scene)
    ? 'Authentic smartphone selfie, front camera at arm\'s length, slightly below angle. Minor imperfections — natural front-camera lens distortion, slight warmth from lighting. '
    : 'Authentic smartphone photograph taken by a friend or bystander, rear camera, natural framing, from 1.5-2 meters away. Slightly candid, not perfectly composed, natural available light. ';

  // Face preservation instruction
  const facePreservation = hasDualImages
    ? ' CRITICAL: The fan must be the EXACT same person as the first reference image. The footballer must be the EXACT same person as the second reference image. Preserve both faces, skin tones, hair, and all distinguishing features with 100% accuracy. Do not blend or mix their faces.'
    : ' CRITICAL: The fan must be the EXACT same person as the reference/input image. Preserve their face, skin tone, hair, and all distinguishing features with 100% accuracy. The footballer should look like the real ' + playerName + ' — use your knowledge of this famous person to generate an accurate likeness.';

  // Build scene text with placeholder replacements
  const replacePlaceholders = (text: string) =>
    text
      .replace(/\[FAN\]/g, fanDesc)
      .replace(/\[PLAYER\]/g, playerDesc)
      .replace(/\[JERSEY\]/g, jerseyDesc)
      .replace(/\[COUNTRY\]/g, playerCountry);

  const actionText = replacePlaceholders(template.action);
  const detailsText = replacePlaceholders(template.details);

  return `${cameraPrefix}${actionText} ${detailsText} ${PHOTO_STYLE}${facePreservation}`;
}

export { sceneTemplates, PLAYER_DESCRIPTIONS };

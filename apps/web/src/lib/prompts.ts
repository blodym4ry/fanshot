/**
 * FanShot Prompt Engine v6 — Two-Stage Pipeline
 *
 * STAGE 1: Generate a scene image from scratch (no reference image).
 *   - Model: fal-ai/flux-pro/kontext/max (text-to-image, no image_url)
 *   - Creates a two-person photo: a generic male fan + a famous footballer
 *   - The fan's face must be clearly visible for Stage 2 face swap
 *
 * STAGE 2: Face swap the fan's face with the user's selfie.
 *   - Model: easel-ai/advanced-face-swap
 *   - Replaces the generic fan face with the user's actual face
 *
 * Prompt structure:
 *   CAMERA_PREFIX + FAN_DESC + SCENE_ACTION + PLAYER_DESC + SCENE_DETAILS + PHOTO_STYLE + FACE_VISIBILITY
 */

/* ─── Detailed physical descriptions for top players ──── */

const PLAYER_DESCRIPTIONS: Record<string, string> = {
  // ═══ TOP GLOBAL STARS ═══
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

/* ─── Photo style constants ──────────────────────────── */

const PHOTO_STYLE =
  'The photograph must be indistinguishable from a real smartphone photo — natural camera sensor noise, realistic depth of field, imperfect framing, authentic available lighting, slight motion blur. Realistic skin with pores and natural imperfections. No extra fingers, perfect human anatomy, natural proportions. NOT a render, NOT AI art, NOT a professional photoshoot.';

const FAN_DESC =
  'a male fan in his late 20s, average build, clean shaven, wearing casual clothes (dark t-shirt and jeans)';

const FACE_VISIBILITY =
  'CRITICAL REQUIREMENT: The fan\'s face must be clearly visible, well-lit, unobstructed, and facing the camera directly with both eyes visible. The fan\'s face must occupy a significant portion of the frame and be in sharp focus — this is essential for post-processing. Do not obscure, shadow, or partially hide the fan\'s face in any way.';

/* ─── Scene templates for text-to-image generation ────── */

interface SceneTemplate {
  /** Camera / framing prefix */
  camera: string;
  /** The scene action description */
  action: string;
  /** Environmental / setting details */
  details: string;
}

const sceneTemplates: Record<string, SceneTemplate> = {
  tunnel_encounter: {
    camera:
      'Ultra-realistic smartphone selfie photograph, front camera at arm\'s length, slightly below angle, minor front-camera lens distortion, warm fluorescent lighting.',
    action:
      '[FAN] takes a quick selfie with [PLAYER] in a concrete stadium tunnel right after a FIFA World Cup 2026 match. [PLAYER] is wearing the [COUNTRY] national team jersey ([JERSEY]), visibly sweaty with flushed cheeks and damp hair, has briefly stopped walking to lean into the fan\'s selfie frame. [PLAYER] gives a quick polite smile — clearly gracious but in a hurry to get to the locker room. [FAN] holds the phone up with one extended arm, looking excited and slightly nervous, eyes wide with disbelief.',
    details:
      'Concrete tunnel walls with exposed pipes along the ceiling, dim flickering fluorescent overhead lights casting slightly greenish tint, other staff members and substitute players walking past blurred in the background, equipment bags visible against the wall, the tunnel floor is slightly wet. The selfie captures both faces at close range with the typical front-camera wide-angle distortion. A security guard is partially visible at the edge of the frame.',
  },

  pitchside_quick: {
    camera:
      'Ultra-realistic smartphone selfie photograph, front camera held high, tilted down slightly, natural floodlight illumination with slight lens flare.',
    action:
      '[FAN] has managed a quick selfie with [PLAYER] at the edge of the pitch after a FIFA World Cup 2026 match. [PLAYER] in the [COUNTRY] match-worn jersey ([JERSEY]), visible grass stains on the white shorts, sweat glistening on the forehead and temples, has leaned over the advertising board barrier specifically for this fan photo. [PLAYER] flashes a quick tired smile, still catching breath. [FAN] reaches up excitedly with the phone from the front row of the stands, leaning forward over the barrier, grinning broadly.',
    details:
      'Bright green pitch stretching into the background, stadium floodlights creating dramatic backlight and slight lens flare, rows of colorful seats rising behind the fan, a few other fans in the front rows waving and cheering, LED advertising boards displaying sponsor logos along the pitch perimeter, scattered confetti on the grass. The evening sky is visible above the stadium roof. Shot has the characteristic selfie distortion from the close distance.',
  },

  mixed_zone: {
    camera:
      'Ultra-realistic smartphone photograph taken by a friend or bystander from about 2 meters away, rear camera, natural harsh fluorescent lighting, slightly off-center composition.',
    action:
      '[FAN] standing next to [PLAYER] in the mixed zone media area right after a World Cup 2026 match. [PLAYER] in the [COUNTRY] jersey ([JERSEY]) with a white towel draped over one shoulder, face still flushed and shiny from exertion, hair slightly disheveled from the match. They stand side by side with a small gap between them — not touching, just close enough for the photo. [FAN] is smiling broadly with hands at his sides. [PLAYER] gives a tired but genuine half-smile, eyes slightly squinted from the harsh lights.',
    details:
      'FIFA World Cup 2026 branded media backdrop with repeating sponsor logos visible behind them, harsh white fluorescent overhead lighting creating slight shadows under their eyes, a microphone boom partially visible at the top edge, other journalists and camera crews working in the blurred background, cables running along the floor, credential lanyards visible on several people. The floor is polished concrete. Someone else\'s camera flash reflects faintly in the backdrop.',
  },

  training_ground: {
    camera:
      'Ultra-realistic smartphone photograph taken by a bystander, rear camera, bright natural daylight, candid composition from about 1.5 meters away.',
    action:
      '[FAN] posing for a photo with [PLAYER] at an open World Cup 2026 training session. [PLAYER] is wearing the [COUNTRY] training kit — casual athletic wear in team colors ([JERSEY] colors), a light training bib over the top — and has jogged over to the perimeter barrier fence to greet fans. They stand on opposite sides of a low metal barrier fence, [PLAYER] leaning on it casually with one arm, slightly out of breath from training drills. [FAN] is beaming with excitement, standing right against the barrier on the public side.',
    details:
      'Lush green training pitch stretching behind [PLAYER] with orange training cones scattered around, other squad players stretching and passing balls in small groups in the distance, coaching staff with clipboards visible, team equipment bags lined up along the sideline, a temporary shade canopy in the far background. Bright outdoor daylight casting natural shadows, blue sky with scattered clouds. A few other fans are visible along the barrier taking photos with their phones.',
  },

  hotel_encounter: {
    camera:
      'Ultra-realistic smartphone selfie photograph, front camera at arm\'s length, warm ambient indoor lighting, natural hotel lobby ambiance.',
    action:
      '[FAN] has spotted [PLAYER] in the lobby of a luxury five-star hotel and nervously asked for a quick selfie. [PLAYER] is dressed in smart casual designer clothing — a clean fitted black t-shirt, expensive-looking watch on the wrist, tailored jogger pants — looking relaxed and freshly groomed, clearly off-duty. [PLAYER] politely leans slightly toward the camera with a casual friendly smile. [FAN] holds the phone up with a slightly trembling hand, looking thrilled and starstruck, mouth open in excited disbelief.',
    details:
      'Elegant hotel lobby with polished marble floor reflecting the warm lights, modern designer furniture — leather sofas and glass coffee tables — in the background, tall indoor plants, a reception desk with staff partially visible, warm amber recessed lighting creating a luxurious atmosphere. Other hotel guests walk past in the background, slightly motion-blurred. A large abstract painting is visible on the wall. The lobby has floor-to-ceiling windows showing a city skyline at dusk.',
  },

  stadium_exit: {
    camera:
      'Ultra-realistic smartphone photograph taken by a friend, rear camera, dramatic night lighting from stadium exterior floods, slightly grainy from low light.',
    action:
      '[FAN] standing next to [PLAYER] outside the stadium after a World Cup 2026 night match. [PLAYER] is wearing the [COUNTRY] team tracksuit or post-match jacket in team colors ([JERSEY] colors), wearing large over-ear headphones around the neck, carrying a small designer bag, about to board the team bus. [PLAYER] has stopped for just a brief moment for this photo and gives a quick but warm smile. [FAN] is standing close but not touching, grinning ear to ear.',
    details:
      'Night-time scene with powerful stadium exterior floodlights creating dramatic backlighting and long shadows on the concrete, the sleek team coach bus visible behind them with its interior lights on, a small crowd of waiting fans held back by metal barriers, security personnel in dark suits partially visible at the edges, parking lot with several luxury cars, steam rising from a nearby grate. The stadium\'s illuminated exterior architecture towers in the background. A few phone camera flashes from other fans create small light spots.',
  },

  celebration_moment: {
    camera:
      'Ultra-realistic smartphone photograph captured in the chaos of celebration, rear camera, dramatic floodlight illumination, slightly blurred edges from movement.',
    action:
      '[FAN] on the pitch alongside [PLAYER] during ecstatic post-match celebrations after [COUNTRY] won their FIFA World Cup 2026 match. [PLAYER] in the [COUNTRY] jersey ([JERSEY]), absolutely ecstatic — sweaty, jersey untucked and pulled out, shorts slightly askew, one arm raised triumphantly in the air. [FAN] has somehow gotten onto the pitch during the wild pitch invasion and is right next to the player, fist pumping with pure euphoria, face contorted in a scream of joy.',
    details:
      'Colorful confetti raining down everywhere catching the floodlights, other celebrating players hugging and sliding on the pitch in the background, a massive crowd of fans who have invaded the pitch creating a chaotic joyful mass, stadium floodlights creating an electric bright atmosphere, giant screens showing replays, torn-up pitch grass and divots visible, discarded flags and scarves on the ground. The frame is slightly tilted from the chaos. Someone nearby is spraying water from a bottle.',
  },

  autograph_line: {
    camera:
      'Ultra-realistic smartphone photograph taken from across a table, rear camera, indoor event lighting, composed but slightly off-center framing.',
    action:
      '[FAN] at an official FIFA Fan Zone autograph session with [PLAYER]. [PLAYER] is sitting behind a long signing table wearing the [COUNTRY] team polo shirt or branded casual wear in team colors ([JERSEY] colors), a marker pen in hand, stacks of photos and merchandise on the table. [FAN] is standing on the other side of the table, leaning forward slightly with a big smile, both hands on the table edge. [PLAYER] looks up at the camera with a practiced warm media smile, pausing from signing.',
    details:
      'Official FIFA World Cup 2026 and sponsor branding on a large backdrop behind them with repeating logos, professional indoor event lighting with softboxes creating even illumination, a queue of excited fans visible stretching behind in the background, velvet rope barriers guiding the line, security staff in polo shirts standing nearby, bottles of water and marker pens scattered on the table, a small placard with [PLAYER]\'s name and number visible. Other fans are taking photos from behind the rope.',
  },

  warmup_pitch: {
    camera:
      'Ultra-realistic smartphone selfie photograph from a high angle in the stands, front camera, beautiful golden hour natural light, slight upward perspective.',
    action:
      '[FAN] taking a selfie from the front row of the stands during the World Cup 2026 pre-match warmup. [PLAYER] in the [COUNTRY] training warmup bib ([JERSEY] colors) has just jogged over to the barrier and leaned close to the advertising boards for a quick interaction with fans. [PLAYER] is loose and relaxed with focused pre-match energy, offering a slight confident smile. [FAN] is reaching forward and downward with the phone from the elevated first row, face lit up with excitement.',
    details:
      'The nearly empty stadium rising behind them with thousands of seats in various colors, pristine unmarked green pitch glistening in the golden light, white pitch markings freshly painted, other squad players doing stretching exercises and rondo drills in the distance, coaching staff standing with arms crossed watching, ball bags and training equipment scattered on the sideline. Late afternoon golden hour sunlight streaming into the stadium creating long warm shadows and beautiful rim lighting on both faces. The stadium\'s scoreboard shows the upcoming match details.',
  },

  airport_arrival: {
    camera:
      'Ultra-realistic smartphone selfie photograph, front camera at arm\'s length, bright artificial terminal lighting, typical airport ambiance.',
    action:
      '[FAN] taking a selfie with [PLAYER] in a busy international airport terminal. [PLAYER] is in smart casual travel clothing — a designer bomber jacket over a plain t-shirt, comfortable fitted pants, clean white sneakers, dark sunglasses pushed up on top of the head — pulling a luxury carry-on suitcase with one hand. [PLAYER] has stopped briefly in the middle of the terminal concourse for this fan photo, giving a quick friendly but slightly tired smile. [FAN] is clearly excited, eyes wide, holding the phone up.',
    details:
      'Modern airport terminal with high ceilings and glass walls, departure information boards showing flight times in the background, other travelers walking with luggage creating slight motion blur, duty-free shop storefronts with illuminated displays visible, polished reflective terminal floor, overhead directional signage, a coffee shop counter visible in the distance. Bright white terminal lighting with some natural light coming through the large windows. A bodyguard or team official in a suit is partially visible just behind [PLAYER].',
  },
};

/* ─── Public API ──────────────────────────────────────── */

export interface PlayerPromptData {
  playerName: string;
  playerCountry: string;
  playerNumber?: number;
  teamColors?: [string, string] | string;
}

/**
 * Get the detailed player description for the prompt.
 * Falls back to a generic description with name + country.
 */
export function getPlayerDescription(playerName: string, playerCountry: string): string {
  if (PLAYER_DESCRIPTIONS[playerName]) {
    return PLAYER_DESCRIPTIONS[playerName];
  }
  return `${playerName}, the famous ${playerCountry} international footballer`;
}

/**
 * Build the scene generation prompt (Stage 1).
 * No reference image — generates a complete scene from text only.
 *
 * @param scene  — scene ID (e.g. 'tunnel_encounter')
 * @param player — player metadata
 */
export function buildPrompt(
  scene: string,
  player: PlayerPromptData,
): string {
  const template = sceneTemplates[scene];
  if (!template) {
    throw new Error(`Unknown scene: ${scene}`);
  }

  const { playerName, playerCountry } = player;

  // Get jersey color description
  const teamColorsStr = typeof player.teamColors === 'string'
    ? player.teamColors
    : Array.isArray(player.teamColors)
      ? `${player.teamColors[0]} and ${player.teamColors[1]}`
      : '';
  const jerseyDesc = JERSEY_COLORS[playerCountry] || teamColorsStr || 'team colors';

  // Get detailed player description
  const playerDesc = getPlayerDescription(playerName, playerCountry);

  // Replace placeholders
  const replacePlaceholders = (text: string) =>
    text
      .replace(/\[FAN\]/g, FAN_DESC)
      .replace(/\[PLAYER\]/g, playerDesc)
      .replace(/\[JERSEY\]/g, jerseyDesc)
      .replace(/\[COUNTRY\]/g, playerCountry);

  const cameraText = template.camera;
  const actionText = replacePlaceholders(template.action);
  const detailsText = replacePlaceholders(template.details);

  return `${cameraText} ${actionText} ${detailsText} ${PHOTO_STYLE} ${FACE_VISIBILITY}`;
}

export { sceneTemplates, PLAYER_DESCRIPTIONS };

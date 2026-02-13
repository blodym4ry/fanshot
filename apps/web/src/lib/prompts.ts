/**
 * FanShot Prompt Engine v3
 *
 * Simplified: no manual user details form.
 * FLUX Kontext Pro sees the selfie via image_url and preserves the face.
 * [USER_DESC] = "the person shown in the reference photo"
 * Face preservation instruction added to PHOTO_SUFFIX.
 */

/* ─── Photo type prefixes ─────────────────────────────── */

const SELFIE_PREFIX =
  'Authentic smartphone selfie, taken with front camera at arm\'s length, slightly from below angle. Minor imperfections: not perfectly centered, natural front-camera lens distortion, slight warmth from indoor/outdoor lighting. ';

const THIRD_PERSON_PREFIX =
  'Authentic smartphone photograph taken by a friend or bystander. Shot with rear camera, natural framing, the photographer is standing 1.5-2 meters away. Slightly candid feel, not perfectly composed. Natural available light, no flash. ';

const PHOTO_SUFFIX =
  ' This must look identical to a real photograph posted on social media. NOT a render, NOT AI art, NOT a professional photoshoot. Real camera sensor noise at high ISO, natural depth of field, authentic color grading from smartphone processing. Realistic skin with pores, natural under-eye shadows, authentic fabric wrinkles on clothing. No extra fingers, perfect human anatomy, natural proportions. CRITICAL: The fan in this image must be the EXACT same person as shown in the reference/input image. Preserve their face, skin tone, hair color, hair style, facial hair, and all distinguishing features with 100% accuracy. Do not alter their appearance in any way.';

/* ─── User description (auto from reference image) ──── */

const USER_DESC = 'the person shown in the reference photo';

/* ─── Scene type: selfie vs third-person ──────────────── */

const SELFIE_SCENES = new Set([
  'tunnel_encounter',
  'pitchside_quick',
  'hotel_encounter',
  'airport_arrival',
  'warmup_pitch',
]);

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

/* ─── Scene prompt templates ──────────────────────────── */

const sceneTemplates: Record<string, string> = {
  tunnel_encounter:
    '[USER_DESC] is taking a quick selfie with [PLAYER_NAME], the famous [COUNTRY] international footballer, in a stadium tunnel after a FIFA World Cup 2026 match. [PLAYER_NAME] is wearing [COUNTRY] national team jersey ([TEAM_COLORS]), visibly sweaty with flushed cheeks, has briefly stopped walking to lean into the fan\'s selfie. [PLAYER_NAME] gives a quick, polite smile — clearly being gracious but in a hurry. [USER_DESC] is holding the phone up with one hand, looking excited and slightly nervous. Concrete tunnel walls, dim fluorescent overhead lights, other staff and players walking past in the blurred background. The selfie captures both faces at close range, [PLAYER_NAME] slightly taller in frame.',

  pitchside_quick:
    '[USER_DESC] has managed a quick selfie with [PLAYER_NAME], the famous [COUNTRY] international footballer, at the edge of the pitch after a World Cup match. [PLAYER_NAME] in [COUNTRY] match jersey ([TEAM_COLORS]), grass stains on shorts, sweat glistening on forehead, has leaned over the advertising board barrier for the photo. [USER_DESC] is reaching up with the phone from the front row. Stadium seats, green pitch, and floodlights creating slight lens flare in background. Excited crowd partially visible. Quick, spontaneous moment.',

  mixed_zone:
    '[USER_DESC] standing next to [PLAYER_NAME], the famous [COUNTRY] international footballer, in the mixed zone area after a World Cup 2026 match. [PLAYER_NAME] in [COUNTRY] jersey ([TEAM_COLORS]) with a towel draped over one shoulder, face still flushed from the match. They are standing side by side with a small gap between them — not touching, just standing close for the photo. [USER_DESC] is smiling broadly. [PLAYER_NAME] gives a tired but genuine half-smile. Media backdrop with FIFA sponsors partially visible behind them. Harsh fluorescent lighting creating slight shadows. A friend or media person took this photo from about 2 meters away.',

  training_ground:
    '[USER_DESC] posing for a photo with [PLAYER_NAME], the famous [COUNTRY] international footballer, at a World Cup 2026 training session. [PLAYER_NAME] in [COUNTRY] training kit (casual athletic wear in [TEAM_COLORS]), has walked to the barrier fence to meet fans. They stand side by side on opposite sides of a low fence, [PLAYER_NAME] leaning on it casually. [USER_DESC] is beaming. Training pitch, cones, and other players stretching visible in the background. Bright outdoor daylight casting natural shadows. Another fan nearby took this photo.',

  hotel_encounter:
    '[USER_DESC] has spotted [PLAYER_NAME], the famous [COUNTRY] international footballer, in a luxury hotel lobby and asked for a quick selfie. [PLAYER_NAME] is in casual designer clothing — clean fitted t-shirt, expensive watch visible, relaxed posture. [PLAYER_NAME] has politely agreed and leans slightly toward the camera with a casual smile. [USER_DESC] holds the phone up, looking thrilled and slightly starstruck. Elegant hotel lobby background with marble floor, modern furniture, warm ambient lighting. Other hotel guests walking past, slightly blurred. A candid, lucky encounter moment.',

  stadium_exit:
    '[USER_DESC] next to [PLAYER_NAME], the famous [COUNTRY] international footballer, outside the stadium after a World Cup 2026 night match. [PLAYER_NAME] in [COUNTRY] team tracksuit or post-match jacket ([TEAM_COLORS]), wearing headphones around neck, holding a phone, about to get on the team bus. Has stopped for a brief moment for this photo. They stand close but not touching. Night time, stadium exterior lights illuminating them, crowd and team bus in background. [USER_DESC] is grinning. Security personnel partially visible. A friend quickly snapped this photo.',

  celebration_moment:
    '[USER_DESC] on the pitch with [PLAYER_NAME], the famous [COUNTRY] international footballer, during post-match celebrations after [COUNTRY] won their World Cup 2026 match. [PLAYER_NAME] in [COUNTRY] jersey ([TEAM_COLORS]), ecstatic, sweaty, jersey slightly untucked. [USER_DESC] has somehow gotten close during the pitch invasion. They stand near each other, [PLAYER_NAME] has an arm raised in celebration, [USER_DESC] is euphoric. Confetti falling, other celebrating players and fans in the chaotic background. Floodlit stadium, electric atmosphere. Someone in the crowd captured this moment.',

  autograph_line:
    '[USER_DESC] at a FIFA fan zone autograph session with [PLAYER_NAME], the famous [COUNTRY] international footballer. [PLAYER_NAME] sitting behind a table wearing [COUNTRY] team polo or branded casual wear ([TEAM_COLORS]), Sharpie pen in hand. [USER_DESC] is standing on the other side of the table, leaning forward slightly with a big smile. [PLAYER_NAME] looks up at the camera with a practiced, warm smile. FIFA and sponsor branding visible on the backdrop. Indoor event lighting, queue of other fans visible in the background. An event photographer or friend took this photo.',

  warmup_pitch:
    '[USER_DESC] taking a selfie from the front row of the stadium during World Cup 2026 warmup. [PLAYER_NAME], the famous [COUNTRY] international footballer, in [COUNTRY] warmup bib ([TEAM_COLORS]) has jogged over to the stands and leaned close to the barrier for a quick photo. [PLAYER_NAME] is loose, relaxed, pre-match focused energy, slight smile. [USER_DESC] reaching forward with the phone, excited. Nearly empty stadium behind them, pristine green pitch, other players warming up in the distance. Late afternoon golden hour light.',

  airport_arrival:
    '[USER_DESC] taking a selfie with [PLAYER_NAME], the famous [COUNTRY] international footballer, at an airport. [PLAYER_NAME] in smart casual travel clothing — designer jacket, comfortable pants, sunglasses pushed up on head, pulling carry-on luggage. Has stopped briefly in the terminal for this fan photo. [PLAYER_NAME] gives a quick, friendly smile. [USER_DESC] is clearly excited. Airport terminal background with departure boards, other travelers, bright terminal lighting. A quick, lucky airport encounter selfie.',
};

/* ─── Public API ──────────────────────────────────────── */

export interface PlayerPromptData {
  playerName: string;
  playerCountry: string;
  playerNumber: number;
  teamColors: [string, string];
}

export function buildPrompt(
  scene: string,
  player: PlayerPromptData
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

  // Select prefix based on scene type
  const prefix = SELFIE_SCENES.has(scene)
    ? SELFIE_PREFIX
    : THIRD_PERSON_PREFIX;

  // Replace placeholders
  const filled = template
    .replace(/\[USER_DESC\]/g, USER_DESC)
    .replace(/\[PLAYER_NAME\]/g, playerName)
    .replace(/\[COUNTRY\]/g, playerCountry)
    .replace(/\[TEAM_COLORS\]/g, jerseyDesc);

  return prefix + filled + PHOTO_SUFFIX;
}

export { sceneTemplates };

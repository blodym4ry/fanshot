import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/src/lib/supabase-admin";

fal.config({ credentials: process.env.FAL_API_KEY });

// ═══════════════════════════════════════════
// YARDIMCI FONKSİYONLAR
// ═══════════════════════════════════════════

function base64ToBlob(base64: string): Blob {
  const parts = base64.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binaryStr = Buffer.from(parts[1], 'base64');
  return new Blob([binaryStr], { type: mime });
}

function getPlayerDescription(playerName: string): string {
  const descriptions: Record<string, string> = {
    "Lionel Messi": "Lionel Messi — light-skinned Argentine man in his late 30s, short brown wavy hair, trimmed brown beard, approximately 170cm tall, lean athletic build, calm gentle warm expression, soft brown eyes",
    "Cristiano Ronaldo": "Cristiano Ronaldo — tall Portuguese man approximately 187cm, dark gelled-back hair with sharp side part, strong prominent jawline, clean shaven or very light stubble, very muscular athletic build, intense confident expression, deep brown eyes",
    "Kylian Mbappé": "Kylian Mbappé — young Black French man in his mid-20s, very short dark buzzed hair almost shaved, athletic tall build approximately 178cm, bright energetic wide smile, clean shaven, high cheekbones, dark brown eyes",
    "Jude Bellingham": "Jude Bellingham — young Black English man in his early 20s, short dark curly fade haircut, tall athletic build approximately 186cm, clean shaven, bright confident smile, strong jawline",
    "Erling Haaland": "Erling Haaland — very tall Norwegian man approximately 194cm, long straight blonde hair often tied back in a bun or ponytail, Nordic features with light skin, extremely large muscular powerful build, intense focused blue eyes",
    "Vinícius Jr": "Vinícius Júnior — young Black Brazilian man in his mid-20s, short dark curly tight hair, lean athletic agile build, medium height approximately 176cm, energetic joyful expression, bright smile",
    "Lamine Yamal": "Lamine Yamal — very young Spanish man approximately 17-18 years old, dark brown skin, short dark curly hair, slim athletic teenage build, boyish excited face, bright dark eyes",
    "Mohamed Salah": "Mohamed Salah — Egyptian man in his early 30s with distinctive large voluminous curly dark afro hair, short neatly trimmed dark beard, medium athletic build approximately 175cm, warm genuine smile",
    "Kevin De Bruyne": "Kevin De Bruyne — Belgian man in his early 30s, distinctive ginger/reddish-blonde short hair, clean shaven, medium height approximately 181cm, athletic build, focused intense blue eyes",
    "Son Heung-min": "Son Heung-min — South Korean man in his early 30s, neat short black straight hair, clean shaven, medium height athletic build approximately 183cm, warm friendly wide welcoming smile, East Asian features",
    "Robert Lewandowski": "Robert Lewandowski — tall Polish man approximately 185cm, short cropped dark brown hair, clean shaven or very light stubble, strong athletic build, sharp angular Eastern European facial features, composed serious expression",
    "Neymar": "Neymar Jr — Brazilian man in his early 30s, light brown skin, medium height approximately 175cm, hairstyle varies but typically styled dark hair with possible highlights or mohawk, lean athletic build, playful charismatic expression",
    "Harry Kane": "Harry Kane — tall English man approximately 188cm, short light brown hair often neatly combed, clean shaven, strong broad-shouldered build, composed professional expression, blue eyes",
    "Arda Güler": "Arda Güler — young Turkish man approximately 19-20 years old, dark brown medium-length wavy hair, clean shaven, slim lean build approximately 176cm, youthful Mediterranean features, eager expression",
    "Hakan Çalhanoğlu": "Hakan Çalhanoğlu — Turkish man in his early 30s, dark short hair, neatly trimmed short dark beard, medium height approximately 178cm, athletic build, serious focused intense expression",
    "Kenan Yıldız": "Kenan Yıldız — young Turkish-German man approximately 19-20 years old, dark brown hair, clean shaven, slim athletic build approximately 182cm, youthful mixed features, eager energetic expression",
    "Jamal Musiala": "Jamal Musiala — young German man of mixed heritage in his early 20s, dark curly medium-length hair, slim tall build approximately 183cm, gentle friendly open smile, light brown skin",
    "Florian Wirtz": "Florian Wirtz — young German man in his early 20s, light brown short hair, slim lean build approximately 176cm, youthful pale skin, determined focused expression",
    "Bukayo Saka": "Bukayo Saka — young Black English man in his early 20s, short dark hair with clean fade, athletic build approximately 178cm, bright wide energetic smile, clean shaven",
    "Phil Foden": "Phil Foden — young English man in his mid-20s, light brown hair sometimes bleached blonde, slim small build approximately 171cm, boyish youthful face, pale skin",
    "Rodri": "Rodri — tall Spanish man approximately 191cm, short dark hair, light neatly trimmed beard, large strong athletic build, calm composed professional expression, dark eyes",
    "Virgil van Dijk": "Virgil van Dijk — very tall Dutch man of Surinamese heritage approximately 193cm, dark curly hair, strong muscular powerful build, commanding authoritative presence, dark skin, trimmed beard",
    "Luka Modrić": "Luka Modrić — Croatian man in his late 30s, distinctive long dirty-blonde/light brown hair past his ears, slim wiry build approximately 172cm, experienced weathered angular face, focused expression",
    "Achraf Hakimi": "Achraf Hakimi — Moroccan-Spanish man in his mid-20s, dark short hair, trimmed dark beard, athletic build approximately 181cm, confident warm smile",
    "Alexander Isak": "Alexander Isak — tall Black Swedish man approximately 192cm, short dark hair with clean fade, lean tall athletic build, calm composed expression",
    "Viktor Gyökeres": "Viktor Gyökeres — tall Swedish man approximately 187cm, light brown short hair with sometimes a beard, athletic muscular build, Nordic features, intense focused expression",
    "Bruno Fernandes": "Bruno Fernandes — Portuguese man in his early 30s, dark brown short hair, medium athletic build approximately 179cm, expressive passionate animated face, light stubble",
    "Martin Ødegaard": "Martin Ødegaard — Norwegian man in his mid-20s, light brown medium-length hair, slim athletic build approximately 178cm, young Nordic features, composed thoughtful expression, blue eyes",
    "Pedri": "Pedri — young Spanish man in his early 20s, dark curly hair, slim lean build approximately 174cm, youthful face, friendly relaxed smile",
    "Gavi": "Gavi — very young Spanish man approximately 20 years old, dark curly hair, slim athletic build, intense passionate energetic expression, Mediterranean features",
  };
  return descriptions[playerName] || `${playerName}, the famous international football player`;
}

// ═══════════════════════════════════════════
// SAHNE DETAYLARI
// ═══════════════════════════════════════════

interface SceneConfig {
  location: string;
  action: string;
  environment: string;
  lighting: string;
  camera: string;
}

function getSceneConfig(scene: string): SceneConfig {
  const scenes: Record<string, SceneConfig> = {
    vip_tunnel: {
      location: "a football stadium VIP players' tunnel, right after a match has ended",
      action: "standing side by side for a quick commemorative photo, with a small natural gap between them. The footballer has one arm casually placed around the fan's shoulder. The fan is beaming with excitement and disbelief",
      environment: "Industrial concrete tunnel walls painted white/light gray with scuff marks. Exposed metal ceiling pipes, cable trays, and ventilation ducts visible overhead. Blue-tinted LED strip lighting along the ceiling casting cool ambient light. A metal fire door or corridor opening visible behind them. Other staff or players walking in the blurred background",
      lighting: "Cool blue-tinted overhead LED strips mixed with warm fluorescent ceiling panels. Side shadows on the tunnel walls. Light falloff creating slight vignette in tunnel depth. Harsh overhead component creating subtle shadows under brows and chin",
      camera: "Shot on iPhone 15 Pro rear camera at approximately 1.5 meters distance by a friend. Portrait orientation 3:4. Slight upward angle. ISO 1000-1600 due to indoor low-light. Natural smartphone noise grain. Shallow depth of field blurring the tunnel background slightly"
    },
    locker_room: {
      location: "a modern premium VIP lounge area inside a major football stadium, adjacent to the players' area",
      action: "posing together for a photo, both facing the camera directly. They stand close but with a natural small gap between them. The footballer is relaxed and gracious, the fan is thrilled",
      environment: "Sleek modern minimalist interior with dark-toned walls (charcoal or navy). Frosted glass partition panels. A football club or national team crest/badge partially visible on the wall behind them. Warm recessed ceiling downlights creating pools of light. Modern leather seating visible in background. Clean polished floor",
      lighting: "Warm ambient downlighting from recessed ceiling spots. Soft golden tone. Gentle shadows under furniture. The subjects are well-lit from above with subtle catch-lights in their eyes. No harsh shadows on faces",
      camera: "Shot on iPhone 15 Pro rear camera from approximately 1.5 meters by a friend. Portrait orientation 3:4. Eye-level. ISO 800 in well-lit room. Natural skin tones, warm white balance. Slight background bokeh from smartphone portrait mode"
    },
    corridor: {
      location: "a wide white-walled corridor inside a football stadium, post-match",
      action: "standing together side by side for a quick photo. The fan is giving an enthusiastic thumbs-up. The footballer has a towel draped around their neck and looks tired but happily posing",
      environment: "Clean white-painted corridor walls with occasional doors (some open showing glimpses of rooms). Polished composite floor reflecting the overhead lights. Fluorescent tube lighting running along the ceiling. A few people walking in the far background, blurred. Fire exit signs. Cable trunking along walls near ceiling",
      lighting: "Harsh bright white fluorescent overhead tube lighting. Creates well-lit even illumination with minimal shadows. Slight green-white color cast typical of fluorescent. Strong catchlights in eyes from overhead tubes. Minimal shadow under chin",
      camera: "Shot on iPhone 15 Pro rear camera from approximately 2 meters by a friend. Portrait orientation 3:4. Eye-level straight-on. ISO 400-800 in bright corridor. Sharp focus on both subjects. Deep depth of field showing corridor extending behind"
    },
    pitchside: {
      location: "at the pitch-side barrier/advertising board area of a large floodlit football stadium during or just after a match",
      action: "the footballer is on the pitch side leaning slightly over the advertising barrier toward the fan who is in the front row of stands reaching toward them. Both smiling for a quick photo",
      environment: "Green manicured football pitch visible behind and below the footballer. LED advertising boards along the barrier. Packed stadium stands rising up behind the fan (blurred crowd). Bright white stadium floodlights creating dramatic top-down illumination. Corner flag or goal frame possibly visible in far background",
      lighting: "Intense bright white stadium floodlights from above creating strong top-down illumination. Dramatic shadows under brows and chin. Bright green pitch reflecting light. LED advertising boards adding colorful rim light. High-contrast scene with bright highlights and deep shadows",
      camera: "Shot on iPhone 15 Pro rear camera from approximately 1.5 meters by the fan's friend in the stands. Portrait orientation 3:4. Slightly upward angle toward the footballer. ISO 800-1200 in bright floodlit stadium. Fast shutter capturing sharp moment. Background crowd beautifully bokeh'd"
    },
    press_area: {
      location: "a FIFA World Cup 2026 official press conference / media mixed zone backdrop area",
      action: "standing side by side in front of the branded backdrop, both facing the camera. The footballer looks professional, the fan is grinning broadly",
      environment: "Official FIFA World Cup 2026 step-and-repeat backdrop with repeating FIFA logo pattern and tournament branding (blue, gold, and white themed). The backdrop fills most of the background. Clean polished floor. Red carpet or gray carpet underfoot. Media area ropes or stanchions partially visible at edges",
      lighting: "Bright even media lighting from multiple professional light sources positioned at 45-degree angles. Fill light reducing harsh shadows. Clean even illumination ideal for photography. Strong catch-lights in eyes. Minimal shadows on the backdrop",
      camera: "Shot on iPhone 15 Pro rear camera from approximately 2 meters. Portrait orientation 3:4. Eye-level. ISO 400 in bright media lighting. Sharp crisp image with excellent exposure. Deep depth of field keeping backdrop text partially readable. Colors accurate and punchy"
    },
    pitch_celebration: {
      location: "on the football pitch of a major stadium during post-match victory celebrations",
      action: "celebrating together — both people looking euphoric and ecstatic. The footballer may have arms raised or be pointing at the fan. The fan is in disbelief and joy. They are facing the camera amidst the chaos",
      environment: "Green football pitch underfoot. Colorful confetti falling through the air. Packed stadium stands in background filled with celebrating fans (blurred). Bright floodlights creating dramatic atmosphere. Other celebrating players and staff visible in blurred background. Possibly a trophy or medal ceremony setup nearby",
      lighting: "Dramatic bright stadium floodlights from above. Confetti catching and reflecting the light creating sparkle effects. Warm golden tint from celebration pyrotechnics. High-energy chaotic lighting with multiple sources. Bright highlights on confetti and sweat on footballer's skin",
      camera: "Shot on iPhone 15 Pro rear camera from approximately 1.5 meters by a friend or staff member. Portrait orientation 3:4. Slightly chaotic framing — not perfectly composed because of the celebration energy. ISO 1000 in bright but dynamic lighting. Motion energy captured — sharp faces but slightly blurred confetti. Vibrant saturated colors"
    },
    bench_area: {
      location: "near the team dugout/bench area on the sideline of a football stadium",
      action: "standing together for a casual photo. The footballer is relaxed, possibly holding a water bottle. The fan looks excited and grateful for the moment",
      environment: "Team dugout with individual padded seats visible behind them. Water bottles, towels, medical bags on/near the bench. The football pitch and far-side stands visible in background. Substitution board or fourth official area nearby. Warm evening atmosphere",
      lighting: "Mixed lighting — bright stadium floodlights from above combined with warmer dugout area lighting. Interesting light/shadow play from the dugout roof overhang. The subjects are well-lit by floodlights. Warm amber tones in the lower portions, cool white from above",
      camera: "Shot on iPhone 15 Pro rear camera from approximately 1.5 meters. Portrait orientation 3:4. Slightly lower angle looking slightly up. ISO 800 in mixed lighting conditions. Natural warm-cool color contrast. Background stadium gently blurred"
    },
    mixed_zone: {
      location: "the mixed zone / media walkthrough area of a football stadium where players pass by fans and media after matches",
      action: "standing side by side with a natural small gap between them, both facing the camera for a quick grab-shot. The footballer paused briefly to pose. The fan looks like they can't believe their luck",
      environment: "Metal crowd-control barriers on both sides creating a corridor. Tournament or team branded backdrop panels. Concrete floor. Other media people and fans visible in blurred background. Somewhat chaotic post-match atmosphere with people moving around",
      lighting: "Harsh bright overhead fluorescent and LED panel lights typical of mixed zone areas. Even but unflattering top-down lighting. Creates shadows under brows and nose. Bright and clinical. Color temperature slightly cool/neutral white",
      camera: "Shot on iPhone 15 Pro rear camera from approximately 1.5 meters, taken quickly. Portrait orientation 3:4. Slightly rushed framing — not perfectly centered. ISO 800 in bright mixed zone. Sharp but with that 'grabbed quickly' energy. Some motion blur on background people walking past"
    },
    warmup: {
      location: "the front row of stadium stands right at the pitch-side barrier, during the team's pre-match warmup session",
      action: "the footballer has walked over to the barrier to greet the fan. The fan is leaning forward excitedly over the barrier. Both smiling at the camera. Casual friendly interaction — the footballer reached out to fans during warmup",
      environment: "Nearly empty stadium stands (pre-match warmup so sparse crowd). Green pitch behind the footballer with other players warming up in the distance (blurred). Advertising boards along the barrier. Beautiful golden-hour warm sunlight streaming into the open-roof stadium",
      lighting: "Beautiful warm golden-hour natural sunlight entering the stadium from a low angle. Warm amber tones on skin and surfaces. Long soft shadows. Gorgeous natural rim-light highlighting hair edges. The most cinematically beautiful lighting of all scenes",
      camera: "Shot on iPhone 15 Pro rear camera from approximately 1 meter by the fan's friend next to them. Portrait orientation 3:4. Slightly downward angle from stands toward pitch level. ISO 200-400 in bright natural daylight. Beautiful warm color rendition. Excellent natural bokeh on the distant pitch and empty stands"
    },
    fan_zone: {
      location: "an outdoor FIFA World Cup 2026 official fan zone / fan festival area in a major city",
      action: "standing together smiling broadly at the camera in the festive atmosphere. Casual and fun energy. The footballer might be in appearance-event mode — friendly and open",
      environment: "Colorful FIFA World Cup 2026 branded decorations and signage. Large LED screens showing match footage in background. Food and drink stalls. Other diverse international fans walking around in team jerseys (blurred). Festival-style string lights or overhead structures. Outdoor area with sky visible",
      lighting: "Outdoor natural daylight (afternoon sun) mixed with colorful event lighting from LED screens and festival decorations. Bright and cheerful. Even lighting on subjects from open sky. Some colorful ambient bounce from nearby branding. Festive warm atmosphere",
      camera: "Shot on iPhone 15 Pro rear camera from approximately 1.5 meters by a friend. Portrait orientation 3:4. Eye-level. ISO 100-200 in bright outdoor daylight. Vibrant punchy colors from the colorful surroundings. Sharp focus on subjects with gently blurred festive background"
    }
  };

  return scenes[scene] || scenes['vip_tunnel'];
}

// ═══════════════════════════════════════════
// MASTER PROMPT BUILDER
// ═══════════════════════════════════════════

function buildPrompt(scene: string, playerName: string, playerCountry: string, teamColors: string): string {
  const playerDesc = getPlayerDescription(playerName);
  const s = getSceneConfig(scene);

  return `Using the uploaded photo ONLY as a facial identity reference, create an ultra-photorealistic photograph of exactly TWO people standing together.

PERSON 1 — THE FAN (from uploaded reference photo):
- Extract and preserve this person's COMPLETE facial identity from the uploaded reference image: exact face shape, eye spacing, eye shape and color, nose bridge and tip, lip shape and thickness, jawline contour, cheekbone structure, skin tone and texture, facial hair if any, ear shape, and all natural proportions
- Their face must be 100% identical to the uploaded reference — the same exact unique person, NOT a similar-looking person or generic face
- Do NOT copy the pose, clothing, background, or camera angle from the reference photo — only use it for facial identity
- Dress them in casual fan clothing: dark colored hoodie or t-shirt, jeans, and sneakers. Regular everyday appearance
- Expression: genuinely excited, happy, slightly starstruck but naturally smiling

PERSON 2 — THE FOOTBALLER:
- ${playerDesc}
- Wearing the official ${playerCountry} national football team home jersey/kit in ${teamColors || 'the team colors'}. The jersey must look completely authentic with proper fabric texture showing realistic polyester mesh weave, visible national team crest/federation badge on the chest, manufacturer logo (Nike or Adidas), realistic collar details, and proper fit on an athletic body
- Expression: relaxed, friendly, genuine slight smile — the look of a player who has stopped briefly to take a photo with a fan

SCENE & ACTION:
- Location: ${s.location}
- Action: ${s.action}

ENVIRONMENT DETAILS:
${s.environment}

LIGHTING:
${s.lighting}

CAMERA & TECHNICAL SPECIFICATIONS:
${s.camera}
- Both people must be looking directly at the camera lens
- Natural skin texture visible — real pores, subtle blemishes, natural under-eye areas, realistic skin shine/oiliness
- Authentic fabric wrinkles and creases on all clothing
- Consistent single-source shadows throughout — no conflicting shadow directions
- Slightly imperfect composition — not perfectly centered, as a real quick fan photo would be. Maybe one person slightly cut off at the edge, or the framing slightly tilted

CRITICAL IDENTITY CONSTRAINTS:
- The fan's face MUST be the EXACT same person as in the uploaded reference photo — 100% identity match with zero drift
- The footballer MUST be clearly and unmistakably recognizable as the real ${playerName} — anyone who follows football should instantly identify them
- Both people must appear to genuinely occupy the same physical 3D space with coherent perspective, scale, and consistent lighting/shadows between them
- Natural human body proportions — correct number of fingers (5 per hand), no extra limbs, proper arm length and joint positions
- The photograph must be completely indistinguishable from a real iPhone photo posted on Instagram

AVOID: identity drift on either person, generic AI-generated faces, beauty filter smoothing, plastic or waxy skin texture, symmetrical perfect composition, HDR tonemapping glow, oversaturated colors, any watermarks or text overlays on the image, any logos or branding burned into the image, anatomy errors (extra fingers or limbs or distorted joints), pasted/floating/cutout appearance of either person, mismatched lighting direction or color temperature between the two people, halo or fringing edges around either person, uncanny valley dead eyes, teeth that look too perfect or uniform, hair that looks like a wig or helmet.`;
}

// ═══════════════════════════════════════════
// MOCK RESPONSE
// ═══════════════════════════════════════════

function getMockResponse() {
  return NextResponse.json({
    imageUrl: "https://placehold.co/768x1024/1a1a2e/gold?text=FanShot+Preview",
    description: "Mock generation — set FAL_API_KEY for real AI generation",
    mock: true
  });
}

// ═══════════════════════════════════════════
// ANA API ROUTE
// ═══════════════════════════════════════════

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { selfieBase64, scene, playerName, playerCountry, playerTeamColors } = body;

    // Validasyon
    if (!selfieBase64) {
      return NextResponse.json({ error: "Please upload a selfie photo" }, { status: 400 });
    }
    if (!scene || !playerName) {
      return NextResponse.json({ error: "Please select a player and scene" }, { status: 400 });
    }

    // Mock mode
    if (!process.env.FAL_API_KEY) {
      console.log("[FanShot] ⚠️ No FAL_API_KEY — returning mock");
      return getMockResponse();
    }

    // ═══ ADIM 1: Selfie → fal.ai storage ═══
    console.log("[FanShot] ══════════════════════════════════════");
    console.log("[FanShot] 📤 Uploading selfie to fal.ai storage...");

    const selfieBlob = base64ToBlob(selfieBase64);
    const selfieKB = Math.round(selfieBlob.size / 1024);
    console.log("[FanShot]    Size:", selfieKB + "KB");

    let selfieUrl: string;
    try {
      selfieUrl = await fal.storage.upload(selfieBlob);
      console.log("[FanShot] ✅ Uploaded:", selfieUrl);
    } catch (err: unknown) {
      console.error("[FanShot] ❌ Upload failed:", (err as Error).message);
      return NextResponse.json({ error: "Failed to process photo. Try again." }, { status: 500 });
    }

    // ═══ ADIM 2: Prompt ═══
    const prompt = buildPrompt(scene, playerName, playerCountry, playerTeamColors || "");

    console.log("[FanShot] ══════════════════════════════════════");
    console.log("[FanShot] 🎯 AI Generation Starting");
    console.log("[FanShot] Model: fal-ai/nano-banana-pro/edit");
    console.log("[FanShot] Player:", playerName, "(" + playerCountry + ")");
    console.log("[FanShot] Scene:", scene);
    console.log("[FanShot] Colors:", playerTeamColors || "N/A");
    console.log("[FanShot] Web Search: ON");
    console.log("[FanShot] Prompt:", prompt.length, "chars");
    console.log("[FanShot] ══════════════════════════════════════");

    // ═══ ADIM 3: Generate ═══
    const t0 = Date.now();

    const result = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
      input: {
        prompt: prompt,
        image_urls: [selfieUrl],
        num_images: 1,
        aspect_ratio: "3:4",
        output_format: "png",
        resolution: "1K",
        enable_web_search: true,
        limit_generations: true
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("[FanShot] ⏳ Generating...", Math.round((Date.now() - t0) / 1000) + "s");
        }
      }
    });

    const elapsed = Math.round((Date.now() - t0) / 1000);

    if (!result.data?.images?.[0]?.url) {
      console.error("[FanShot] ❌ No image returned:", JSON.stringify(result.data));
      return NextResponse.json({ error: "No image generated. Please try again." }, { status: 500 });
    }

    const imageUrl = result.data.images[0].url;
    const desc = result.data.description || "";

    console.log("[FanShot] ══════════════════════════════════════");
    console.log("[FanShot] ✅ Stage 1 complete in", elapsed + "s");
    console.log("[FanShot] 🖼️", imageUrl);
    console.log("[FanShot] ══════════════════════════════════════");

    // ═══ AŞAMA 2: FACE SWAP (Easel AI) ═══
    console.log("[FanShot] ══════════════════════════════════════");
    console.log("[FanShot] 🔄 Stage 2: Face Swap (Easel AI)");

    let finalImageUrl = imageUrl; // fallback: aşama 1 görseli

    const FACE_SWAP_TIMEOUT = 120000; // 120 seconds

    try {
      const swapPromise = fal.subscribe("easel-ai/advanced-face-swap", {
        input: {
          face_image_0: { url: selfieUrl },
          gender_0: "male" as const,
          target_image: { url: imageUrl },
          workflow_type: "user_hair" as const,
          upscale: false,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("[FanShot] ⏳ Face swap in progress...", Math.round((Date.now() - t0) / 1000) + "s");
          }
        }
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Face swap timeout")), FACE_SWAP_TIMEOUT)
      );

      const swapResult = await Promise.race([swapPromise, timeoutPromise]);

      if (swapResult.data?.image?.url) {
        finalImageUrl = swapResult.data.image.url;
        console.log("[FanShot] ✅ Face swap complete:", finalImageUrl);
      } else {
        console.warn("[FanShot] ⚠️ Face swap returned no image, using Stage 1 result");
      }
    } catch (swapError: unknown) {
      const errMsg = swapError instanceof Error ? swapError.message : String(swapError);
      console.error("[FanShot] ⚠️ Face swap failed:", errMsg);
      console.log("[FanShot] ↩️ Falling back to Stage 1 result");
    }

    const totalElapsed = Math.round((Date.now() - t0) / 1000);

    console.log("[FanShot] ══════════════════════════════════════");
    console.log("[FanShot] 🎉 DONE — Total:", totalElapsed + "s, Cost: ~$0.19");
    console.log("[FanShot] 🖼️ Final:", finalImageUrl);
    console.log("[FanShot] ══════════════════════════════════════");

    // ═══ SUPABASE STORAGE KAYIT (non-blocking) ═══
    if (isAdminConfigured) {
      try {
        const supabase = createAdminClient();
        const userId = (body.userId as string) || "anonymous";
        const generationId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        console.log("[FanShot] 💾 Saving to Supabase Storage...");

        // 1. Selfie → Supabase storage
        const selfieBuffer = Buffer.from(selfieBase64.split(",")[1], "base64");
        const selfiePath = `${userId}/${generationId}_selfie.jpg`;
        await supabase.storage
          .from("selfies")
          .upload(selfiePath, selfieBuffer, {
            contentType: "image/jpeg",
            upsert: false,
          });
        console.log("[FanShot]    Selfie saved:", selfiePath);

        // 2. Generated image → Supabase storage
        const generatedResponse = await fetch(finalImageUrl);
        if (generatedResponse.ok) {
          const generatedBuffer = Buffer.from(await generatedResponse.arrayBuffer());
          const generatedPath = `${userId}/${generationId}_result.png`;
          await supabase.storage
            .from("generated")
            .upload(generatedPath, generatedBuffer, {
              contentType: "image/png",
              upsert: false,
            });
          console.log("[FanShot]    Generated saved:", generatedPath);

          // 3. Get public URL for the generated image
          const { data: publicUrlData } = supabase.storage
            .from("generated")
            .getPublicUrl(generatedPath);
          const publicUrl = publicUrlData.publicUrl;
          console.log("[FanShot]    Public URL:", publicUrl);

          // 4. DB record — store full public URL, not just path
          const dbResult = await supabase.from("generations").insert({
            user_id: userId !== "anonymous" ? userId : null,
            input_image_url: selfiePath,
            output_image_url: publicUrl,
            scene_type: scene,
            player_style: playerName,
            status: "completed",
          });
          if (dbResult.error) {
            console.warn("[FanShot]    DB insert warning:", dbResult.error.message);
          } else {
            console.log("[FanShot]    DB record created");
          }
        }

        console.log("[FanShot] 💾 Supabase save complete");
      } catch (storageError: unknown) {
        const errMsg = storageError instanceof Error ? storageError.message : String(storageError);
        console.warn("[FanShot] ⚠️ Supabase save failed (non-blocking):", errMsg);
      }
    }

    return NextResponse.json({
      imageUrl: finalImageUrl,
      stageOneUrl: imageUrl,
      description: desc,
      processingTime: totalElapsed,
      mock: false
    });

  } catch (error: unknown) {
    const err = error as Record<string, unknown>;
    console.error("[FanShot] ❌ Error:", error);
    console.error("[FanShot] Details:", JSON.stringify({
      name: err.name,
      message: err.message,
      status: err.status,
      body: err.body
    }, null, 2));

    let msg = "Something went wrong. Please try again.";
    let status = 500;
    const errStatus = err.status as number | undefined;
    const errMessage = (err.message as string) || "";
    const errBody = err.body as Record<string, unknown> | undefined;

    if (errStatus === 422) {
      msg = "Could not process image. Try a clearer photo with face visible.";
      status = 422;
    } else if (errStatus === 429) {
      msg = "Too many requests. Please wait a moment.";
      status = 429;
    } else if (errStatus === 401 || errStatus === 403) {
      msg = "API authentication error. Contact support.";
      status = 401;
    } else if (errMessage.includes("timeout") || errMessage.includes("TIMEOUT")) {
      msg = "Generation timed out. Please try again.";
      status = 504;
    } else if (errBody?.detail) {
      const d = Array.isArray(errBody.detail) ? (errBody.detail[0] as Record<string, string>)?.msg : errBody.detail;
      msg = (d as string) || msg;
    }

    return NextResponse.json({ error: msg }, { status });
  }
}

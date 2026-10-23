---
name: boricua-lyrics
description: Write original song lyrics in an authentic 2020s Puerto Rican (boricua) voice for any music style. The style can come as a Suno or Udio style prompt, a genre (cloud trap, reggaetón, Latin trap, drill, R&B, pop, salsa, plena, bomba, música jíbara) or just a vibe plus a target length. Uses researched PR lingo (clipped spelling, Spanglish, slang, island references from this decade), sizes the word count to the song length, and delivers a ready-to-paste lyrics file with section tags. Use this skill whenever someone asks for letras, lyrics, a song, a hook, a coro or a verse in Spanish with a Puerto Rican accent, boricua slang, reggaetón or trap flavor, or something like Bad Bunny, Jhayco or Eladio Carrión. Also use it when someone pastes a style description that mentions Puerto Rico, even if they never say boricua or skill, and when they ask to rewrite, start over on or tweak lyrics written this way.
---

# Boricua Lyrics

Write original lyrics that sound like a Puerto Rican artist wrote them in the 2020s, for whatever style the user brings.

Why this needs a skill: generic Spanish lyrics sound like translated poetry to a boricua ear. What sells the voice is how people on the island talk now:
- clipped words
- Spanglish
- specific places and island problems
- casual vulgarity
- hooks built on vowel sounds

The reference files hold the research and the lessons. This file holds the process.

## Workflow

### 1. Read the style and set the frame

From the style prompt (or however the user describes the song), pull out:

- **Family:** which entry in `references/style-playbook.md` the style is closest to. Read that entry; it gives the structure, line lengths and hook type.
- **Vocal:** sung or rapped, register, falsetto, whispered parts. These become delivery notes in the section tags.
- **Mood and energy:** party, intimate, flex, melancholy, romantic.
- **Length:** use the user's. If there isn't one, assume 2:30–3:00 and say so.
- **Word budget:** take it from the table below, and count the repeated hooks.

| Feel | Words per minute | 2:30 song | 3:00 song |
|---|---|---|---|
| Slow or atmospheric (cloud trap, slow R&B, bolero) | 60–75 | 150–190 | 180–225 |
| Mid-tempo and sung (reggaetón, pop urbano, salsa) | 80–100 | 200–250 | 240–300 |
| Rap-heavy (hard trap, drill) | 120–160 | 300–400 | 360–480 |

Atmospheric styles need room for pads and reverb. The approved 2:30 cloud-trap song ("Humedá") is about 165 words, and earlier, wordier drafts felt crowded. When in doubt, write less: repeating the hook fills time better than adding new lines.

Write a draft instead of asking questions first, because reacting to a draft is faster for the user. Only ask when the request is truly unclear, for example a radio-clean song where you can't tell how explicit to be.

### 2. Read the earlier songs, so this one doesn't repeat them

The user listens to these songs back to back. A new song that uses the same moves as an earlier one sounds like a copy, even when its scene is new. "Brilla" was liked but called "just like the other song" because it reused almost every move from "Humedá" except its setting.

1. **Find every earlier song:**
   - `references/song-log.md`, the fingerprint of every song written with this skill
   - lyrics files in the working directory: search for `**/*-lyrics.md` and read each one in full
   - any lyrics written earlier in this conversation
2. **List the moves they used up,** row by row, with the fingerprint rows in `song-log.md`: scene and element, hook shape, rhyme vowels, intro and opening line, who talks and how the quote starts, punchline mechanics, the callback object, the sex images, the outro flip, the structure and line counts, and signature phrases.
3. **Make the new song different on every row,** not only in its scene:
   - **Scene:** a different kind of setting and premise. If the last songs were nights with water or wetness, move away from water, heat and rain altogether.
   - **Hook:** a different shape. If the last hooks were one word echoed in parentheses, try a 2–4 word phrase, a question, a line of dialogue, or a call-and-response.
   - **Rhymes:** hook and verse vowels that the last two songs didn't use.
   - **Structure:** a different layout. See the alternates in the cloud-trap entry of `references/style-playbook.md`.
   - **Moves:** keep the techniques (dialogue, a punchline, a callback, a flipped ending), but carry each one out a new way. For example, have him quote her instead of her quoting herself, or end the song on a new image instead of an "out there vs. in here" flip.
   - **Phrases:** reuse no phrase of 3 or more words from an earlier song. Repeat a single word only if it's ordinary.
4. **Check before delivering:** put the new song's fingerprint next to the last two. If any row matches, rewrite that part.

The examples from "Humedá" in steps 4–6 show the techniques. They are already used, so don't reuse them as lines.

### 3. Load the lingo

Read `references/pr-lingo-2020s.md` before writing. At minimum read:
- the checklist (§1)
- how to spell the accent (§2)
- the vocabulary tables that match this song (§4)
- the don'ts (§7)
- the scene kits (§9)

### 4. Pick one concrete scene

Most drafts fail at the concept. Here is what works:

- **One real situation, in a real PR place, at a real time.** Give it physical details you can feel or hear: weather, objects, the phone, sounds. "Humedá" is August in Santurce: the AC is broken, the humidity is 90%, rain hammers a zinc roof, a ceiling fan turns and a coquí sings. The scene kits in §9 of the lingo file are starting points.
- **A hook word with a twist,** meaning a double meaning or a sense only Puerto Rico gives it:
  - *humedá*: the island's humidity, and her wetness
  - *prendía*: lit, high and turned on
  - *el aire*: the air, and the AC
- **Keep it between the people in the song.** Make it mutual desire, both of them into it. Skip cheating, a partner waiting at home, secret affairs, or an ex who is with someone new, unless the user asks for that story. The person this skill was built with rejected every draft that had a third party in it, and cheating is the most worn-out premise in the genre.
- **Be specific, not poetic.** Skip textbook images like alma, corazón roto, luna llena, estrellas, destino and perderse en las nubes. A metaphor works when it comes from an object in the scene, like the fan turning while she turns. A line like *"yo me pierdo en lo' nublao'"* was called "off" because it sounds written, not spoken.
- **Sexual and vulgar is welcome** when the style or the user calls for it (perreo, trap, cloud trap, R&B). Say it plainly, the way friends talk (*chingar, culo, toto, bicho, mamar*). Aim for about one explicit image per couplet, so it reads as sensual, not as a list of body parts. For pop, ballads, or when the user wants it clean, keep it suggestive.

### 5. Write the hook first

- **Make the title the hook phrase.** Keep it short, ideally a word said the PR way (*Humedá*, in the spirit of Bad Bunny's "VeLDÁ").
- **Write 4–8 lines on one vowel-rhyme chain** (for example -á: mojá, sudá, pegá, ma). Put open vowels where the melody lifts.
- **Repeat a 2–4 word cell so it loops** (*dando vuelta' … dando vuelta'*).
- **Put one punchline inside the hook** (*Noventa por ciento y tú más mojá*), and end on the phrase it started with.
- **Adapt it to the family:**
  - reggaetón: a chant with call-and-response
  - salsa or bomba: a short coro the crowd answers
  - EDM: a simple loop

### 6. Build the verses around it

- **Open with the time, the place and the situation** in the first line.
- **Let people talk:** quote a line of dialogue (*Me dice': "Acho, qué calor"*).
- **Use one question with PR word order** (*¿qué tú 'tás esperando?*).
- **Put one punchline in each verse** (*Hasta el coquí 'tá callaíto*).
- **Plant something in verse 1 and pay it off in verse 2.** In "Humedá", the t-shirt she's wearing in verse 1 is on the floor in verse 2.
- **Keep the markers light:**
  - 1–3 English nouns per section
  - one r → l in the whole song
  - clipped spelling only where it shapes the rhyme; the singer handles the rest
- **End on a line that flips the hook** (*Ya escampó allá afuera… aquí adentro, no*).

### 7. Check it before you deliver

Read every line the way a 25-year-old from Santurce or Bayamón would text it. If a line sounds translated, rewrite it. Then check:

- Nothing sounds Mexican, Colombian, Dominican or Spanish (wey, parce, klk, tío…). See §7 of the lingo file.
- The word count is inside the budget.
- There's no third-party or cheating premise, unless the user asked for one.
- The hook still works the fourth time through.
- Every verse has a punchline and a concrete detail.
- r → l appears once or twice at most, and no line has more than 1–2 slang words.
- Next to the earlier songs' fingerprints (step 2), no row matches and no phrase of 3 or more words repeats.

### 8. Deliver

Save the song as a file the user can open, for example `<title-slug>-lyrics.md`, wherever user-facing files go in this environment, and send it to them. Use this template:

```markdown
# <Title>
*<Style family> · <length> · <vocal>*

## Style prompt
(the user's style text, word for word, in a code block; leave it out if they gave none)

## The story
(2–3 sentences: the scene and the twist)

## Lyrics
(in a code block: [Section – delivery note] tags, (parentheses) for ad-libs
and echoes, and every hook written out in full)

## Approximate layout
(table of section, time and line count; then the total word count)

## How it's built
(table: the line → what makes it boricua, or what it does)

## Suno tips
(only when Suno or Udio is involved; see the playbook)
```

Write the lyrics in PR Spanish and the explanations in the user's language. In chat, keep it short: the concept in a line or two, the hook quoted, and the word count.

Then add the song's fingerprint to the bottom of `references/song-log.md`, so the next song can steer clear of it. The lyrics file in the working directory is a record too, since step 2 searches for `*-lyrics.md`.

## When the user reacts

- **"Start over":** write a brand-new concept, title and hook. Don't reuse a premise they passed on, but keep anything they said they liked.
- **"It's off", with no details:** usually the draft is too poetic, too generic, or built on the wrong premise. Change the scene and make it more specific and more spoken. Deliver the new draft, then ask one targeted question (more street? more sexual? sadder?) if you still need direction.
- **"It's like the other song":** compare its fingerprint with the earlier songs in `references/song-log.md`, find every row that matches, and change all of them, not just the scene. Note what read as a copy in the log.
- **"I like it":** offer to fix only the lines that misfire once they hear the render, such as a line too long for the flow or a word the accent trips on.
- **A lasting preference** (like "not about cheating" or "fewer words"): follow it for the rest of the session. If the user wants, add it to this skill's lessons in `references/approved-example.md`.

## Reference files

| File | What's in it | When to read it |
|---|---|---|
| `references/pr-lingo-2020s.md` | The lingo study: accent spelling, Spanglish, vocabulary by theme, 2020s island references, dated vs. current words, don'ts, idioms, scene kits and sources | Before every song |
| `references/song-log.md` | The fingerprint of every song written so far: scene, hook shape, rhymes, punchlines, callback, outro, structure and signature phrases | Before every song (step 2), and add to it after each delivery |
| `references/style-playbook.md` | Structure, line length, hook type and word budget for each style family, plus Suno/Udio formatting | The entry for the requested style |
| `references/approved-example.md` | "Humedá", the song the user approved, annotated, plus the rejected drafts and why they missed | To calibrate tone, and after negative feedback |

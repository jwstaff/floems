// Stephen Fry-voiced prompts organized by week

export const week1Prompts = [
  "I wonder if you might indulge me for a moment. What texture, if you were to notice it now, seems to dominate your immediate surroundings? Smooth? Rough? Something altogether more interesting?",

  "Do forgive the imposition, but would you mind terribly listening—really listening—for thirty seconds? What sound, however faint, is trying hardest not to be noticed?",

  "Color, of course, is everywhere. But which color is claiming this particular moment as its own? And why do you suppose it's winning?",

  "If this place had a scent—and I don't mean the literal one, but the word that captures its essence—what might that word be? Petrichor? Vanilla? Regret?",

  "Light, as you may have noticed, has opinions about where it falls. What is it illuminating right now that you hadn't quite registered before?"
];

export const week2Prompts = [
  "Here's a thought experiment: imagine yourself the size of an ant. From that rather diminished vantage point, what would be the most extraordinary thing about where you're sitting?",

  "A stranger walks past right now—completely unaware of your existence, naturally. What would they notice about this place that you, in your familiarity, have long since stopped seeing?",

  "If this moment were a season—and I'm aware it already technically is one—which season does it feel like in its bones? Spring's hope? Autumn's resignation? Something else entirely?",

  "Geometry, I'm afraid to say, is inescapable. What shape is your current space insisting upon? Circles? Sharp angles? That peculiar geometry of modern life—the rectangle?",

  "Consider, if you will, the negative space. Not what's here, but what's conspicuously absent. What is this place missing that makes it precisely what it is?"
];

export const week3Prompts = [
  "Now this is rather harder to pin down, but what feeling—if feelings could inhabit corners—seems to be lurking in the margins of this space?",

  "Imagine, just for a moment, that this place could speak. Not shout, mind you, but whisper. What secret do you think it might share?",

  "What are you noticing right now that genuinely surprises you? And I do mean genuinely—not the polite surprise we affect, but the real thing.",

  "Temperature, but not the meteorological kind. If this moment had an emotional temperature, would it be warm? Cold? That particular lukewarm that suggests ambivalence?",

  "There's usually something slightly off, slightly wrong, in any given moment. Not catastrophically so, but just... askew. What is it here?"
];

export const week4Prompts = [
  "We're nearly at the end now. Looking back across this month of yours, what moment—if you had to choose just one—seems to want remembering most insistently?",

  "This week has given you several moments already. Which one felt most alive? And by alive, I mean the kind of alive that makes you glad you were paying attention.",

  "Patterns, I find, reveal themselves only in retrospect. What pattern have you noticed in your own noticing this month? Any themes emerging from the chaos?",

  "If your month were a book—and I suppose in a way it is becoming one—what would you title it? Something honest, if you please, not something marketable.",

  "One more for the road: what has this month taught you about the art of paying attention? Or has it been teaching you something else entirely?"
];

export const playfulPrompts = [
  "A challenge, if you're game: find something purple. Anything at all. Now, why on earth is it there?",

  "Beauty in brokenness—there's always some, if you look. What's broken here that's rather more beautiful for it?",

  "Movement where there shouldn't be any. Or perhaps stillness where you'd expect motion. Which is it, and what's it doing?",

  "Describe where you are using only food words. Crispy? Buttery? Stale? I'm curious to see what you come up with.",

  "What's the most mundane object in your vicinity? Excellent. Now write about it as if it's the most fascinating thing you've ever encountered.",

  "If you were to anthropomorphize this space—give it a personality, a mood, perhaps a slight drinking problem—what sort of character would it be?",

  "Listen for something that's trying very hard to be rhythmic but isn't quite managing it. What's the source of this almost-rhythm?",

  "There's usually something absurd happening if you look closely enough. What's the tiny absurdity of this moment?"
];

export const encouragementPrompts = [
  "No pressure whatsoever, but you've been rather good at this lately. Just thought you should know.",

  "I notice you noticed that one yourself. Splendid. That's rather the point, isn't it?",

  "Some days nothing much seems worth capturing, and that's perfectly fine. The practice is in the looking, not always in the finding."
];

export const skipResponses = [
  "Completely understandable. Not every moment demands a poem. See you later, perhaps.",
  "Fair enough. Sometimes the noticing is enough without the writing. Carry on.",
  "No worries at all. The prompt will still be here if you change your mind later.",
  "Perfectly fine to skip. The point isn't to capture everything—just the things worth capturing.",
  "I quite understand. Some moments are better left unwritten. Until next time."
];

export const checkIns = {
  day7: {
    day: 7,
    title: "Week One Complete",
    message: "Seven days down, and look at you—still noticing things. That's no small feat in our rather frantic age. How's it feeling so far? (No need to answer—I'm just wondering.)"
  },

  day15: {
    day: 15,
    title: "Halfway There",
    message: "We've reached the middle of the month, which is either encouraging or slightly alarming depending on your temperament. You've captured {count} moments so far. Have a look back at your first one, if you like. Does it feel like a different month already? These things tend to shift under our feet, I find."
  },

  day22: {
    day: 22,
    title: "Final Week Approaches",
    message: "Just nine days left before you'll be assembling all this into something resembling a flip book. No pressure, of course, but you might want to start thinking about which moments truly capture your month. Quality over quantity, as they say. Though who 'they' are, I've never been entirely certain."
  },

  day28: {
    day: 28,
    title: "Nearly There",
    message: "Three days remaining. Time to start curating, I think. Not every moment needs to make it into your Floem—only the ones that feel true to the month. The rest can live quietly in your memory, doing whatever retired moments do."
  }
};

export const compilationGuidance = {
  selection: {
    tooFew: "Only {count} selected? Well, it's your Floem, but I might suggest a few more. Eight to fifteen tends to give the flip book a proper rhythm without overstaying its welcome.",
    tooMany: "That's quite a collection! While I admire your enthusiasm, you might find that trimming to fifteen or so makes for a more focused collection. But again—your call entirely.",
    justRight: "That's {count} moments—a perfectly respectable number. Shall we see about arranging them?"
  },

  arrangement: "Now comes the interesting bit: order. Chronological is perfectly fine if you're feeling literal-minded. But sometimes a thematic arrangement—grouping by mood, or place, or some pattern only you can see—reveals something rather more interesting about the month. Your choice, naturally.",

  scenes: "Add scenes to your moments (optional). Describe where each moment happened in 3-5 words. This gives your flip book a sense of place without being too literal about it.",

  finalPreview: `Well then. Here we are.

Your month, distilled into {count} moments. {count} small acts of attention across the days.

Have a look through—both the flip and the read mode—and make sure it feels honest. If something's not quite right, you can always go back and adjust.

But if it feels true to the month—if it captures something of what it meant to you—then I'd say you're ready to call this complete.

Ready?`
};

export const completionMessage = `And there it is. Your Floem.

Rather satisfying, isn't it? Days of noticing, now gathered into something you can actually hold onto—metaphorically speaking, of course.

You can revisit this anytime you like. Next month will begin with a clean slate, as months tend to do, and we'll start the whole process again.

For now, though: well done. You paid attention. That's rarer than you might think.

See you next month.`;

export const characterGuidance = {
  short: "A few words is enough",
  medium: "Beautiful. Keep going if you want",
  long: "Perfect length. Feel free to stop here."
};

// Helper function to get a random prompt for the current week
export function getPromptForDay(dayOfMonth: number): string {
  const weekNumber = Math.ceil(dayOfMonth / 7);

  // 20% chance of playful prompt
  if (Math.random() < 0.2) {
    return playfulPrompts[Math.floor(Math.random() * playfulPrompts.length)];
  }

  let prompts: string[];
  switch (weekNumber) {
    case 1:
      prompts = week1Prompts;
      break;
    case 2:
      prompts = week2Prompts;
      break;
    case 3:
      prompts = week3Prompts;
      break;
    default:
      prompts = week4Prompts;
  }

  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Get a random skip response
export function getSkipResponse(): string {
  return skipResponses[Math.floor(Math.random() * skipResponses.length)];
}

// Get check-in for the current day if applicable
export function getCheckIn(dayOfMonth: number): typeof checkIns.day7 | null {
  if (dayOfMonth === 7) return checkIns.day7;
  if (dayOfMonth === 15) return checkIns.day15;
  if (dayOfMonth === 22) return checkIns.day22;
  if (dayOfMonth === 28) return checkIns.day28;
  return null;
}

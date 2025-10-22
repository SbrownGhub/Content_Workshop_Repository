// src/ContentCategories.js
import React, { useState } from "react";
import "./index.css";

function ContentCategories() {
  // Categories and their items
  const categories = [
    {
      title: "💼 Authority & Expertise",
      desc: "PURPOSE: Build trust through teaching, analysis, and results",
      colorClass: "text-blue-600",
      items: [
        { title: '"Here\'s How" Tutorial', desc: 'Step-by-step breakdowns (teach your process)' },
        { title: 'The Case Study', desc: 'Share real results with numbers and insights' },
        { title: 'The Resource List', desc: 'Curate your go-to tools, books, or systems' },
        { title: 'The Comparison', desc: '"X vs Y — which actually works?"' },
        { title: 'The Quick Win', desc: '3-minute actionable tip that works today' },
	{ title: 'The Problem/Solution', desc: 'Name a pain point → deliver the fix' },
	{ title: 'How-to content', desc: '7 steps, deep dives, frameworks, roundtables' },
	{ title: 'Mistakes, regrets, and lessons learned', desc: '"What problems you solve", 	“This is what I did, this is what I learned”' },
      ],
    },
    {
      title: "🤓 Perspective & Personality",
      desc: "PURPOSE: Show thought leadership and emotional depth",
      items: [
        { title: 'The Contrarian Take', desc: 'Challenge conventional wisdom with evidence' },
        { title: 'The Discussion', desc: 'Raise big questions ("Is profit a dirty word?")' },
        { title: 'The Rant', desc: 'Energy + opinion = memorable content' },
        { title: 'The Personal Story', desc: 'Share a vulnerable or defining moment' },
        { title: 'The Mistake Story', desc: 'What you got wrong + what you learned' },
	{ title: 'The Unpacking', desc: 'Deep dive into one misunderstood concept' },
	{ title: 'Surprising/Shocking/Contrarian', desc: '“What you love” / “What you believe” / “Your take on good content”' },
      ],
    },
    {
      title: "🎬 Behind the Curtain",
      desc: "PURPOSE: Build trust by revealing what’s real, not polished",
      items: [
        { title: 'The Process Breakdown', desc: 'Show exactly how you do X' },
        { title: 'Day in the Life', desc: 'Your actual workflow or routine' },
        { title: 'Behind-the-Scenes Clips', desc: 'Raw footage of your work in action' },
        { title: 'Live While Recording', desc: 'Cliffhanger to full episode' },
        { title: 'Repurpose All Media', desc: 'Lives → podcasts → blogs → clips' },
      ],
    },
    {
      title: "👥 Audience Collaboration",
      desc: "PURPOSE: Engage by building with them, not for them",
      items: [
        { title: 'Ask Me Anything', desc: 'Collect questions and respond on podcast/socials' },
        { title: 'Crowdsourced Topics', desc: 'Let followers choose your next subject' },
        { title: 'Live Debates or Polls', desc: 'Turn interaction into podcast episodes' },
        { title: 'Follow-ups to Comments', desc: 'Respond to fan DMs or comments publicly' },
        { title: 'Interactive Content', desc: 'Quizzes, games, challenges' },
      ],
    },
    {
      title: "🔁 Reinvention & Repurposing",
      desc: "PURPOSE: Extract maximum value from every idea",
      items: [
        { title: 'Before/After', desc: 'Show transformation or progress over time' },
        { title: 'Repurpose Top Content', desc: 'Recut, repost, reframe winners' },
        { title: 'Create Spin-offs', desc: 'Same content, new platform or context' },
        { title: 'Evergreen Focus', desc: '80% timeless topics, 20% topical hooks' },
      ],
    },
  ];

  // Track which categories are expanded
  const [expanded, setExpanded] = useState({});

  // Map category (by emoji) to number badge colors
  const getCategoryColors = (title) => {
    const emoji = title.split(" ")[0];
    switch (emoji) {
      case "💼": // Authority & Expertise → blue
        return { bg: '#dbeafe', fg: '#2563eb' };
      case "🤓": // Perspective & Personality → purple
        return { bg: '#f3e8ff', fg: '#9333ea' };
      case "🎬": // Behind the Curtain → green
        return { bg: '#dcfce7', fg: '#16a34a' };
      case "👥": // Audience Collaboration → orange
        return { bg: '#ffedd5', fg: '#ea5800' };
      case "🔁": // Reinvention & Repurposing → teal
        return { bg: '#ccfbf1', fg: '#0d9488' };
      default:
        return { bg: '#f3f4f6', fg: '#374151' }; // neutral
    }
  };

  const toggleCategory = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-3">
      {categories.map((category, idx) => {
        const showAll = expanded[idx];
        const visibleItems = showAll ? category.items : category.items.slice(0, 3);

        return (
          <div key={idx} className="formats-card">
            <h3 className="formats-title">
              <span className="formats-emoji">{category.title.split(" ")[0]}</span>
              {category.title.replace(category.title.split(" ")[0], "")}
            </h3>
            <p className="formats-desc">{category.desc}</p>
            <ul className="formats-list">
              {visibleItems.map((item, i) => {
                const { bg, fg } = getCategoryColors(category.title);
                return (
                  <li key={i} className="formats-item">
                    <div className="formats-number" style={{ background: bg, color: fg }}>{i + 1}</div>
                    <div>
                      <p className="formats-item-title">{item.title}</p>
                      <p className="formats-item-desc">{item.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            {category.items.length > 3 && (
              <button
                onClick={() => toggleCategory(idx)}
                className="formats-toggle-btn"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ContentCategories;
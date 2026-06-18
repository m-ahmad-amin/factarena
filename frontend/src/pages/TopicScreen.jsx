import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen, Sparkles, Search, ArrowRight, ArrowLeft, Coffee, Compass, HelpCircle, Check } from 'lucide-react';
import { generateNicheTopic } from '../services/groq';

const PRESETS = [
  {
    id: 'everyday',
    category: 'Everyday Debates',
    description: 'Lighthearted dilemmas, food arguments, and daily routines.',
    icon: Coffee,
    accent: 'var(--color-player-a)',
    topics: [
      'Pineapple belongs on pizza.',
      'Cats make better house pets than dogs.',
      'All schools should ban homework entirely.',
      'Instagram is a better social platform than TikTok.'
    ]
  },
  {
    id: 'choices',
    category: 'Fun Choices',
    description: 'Tough lifestyle preferences, leisure activities, and hobbies.',
    icon: Compass,
    accent: 'var(--accent-primary)',
    topics: [
      'Summer is a better season than winter.',
      'Video games are a better hobby than watching movies.',
      'It is better to be a student than an adult with a job.',
      'Marvel movies are better than DC movies.'
    ]
  },
  {
    id: 'hypotheticals',
    category: 'Wild Hypotheticals',
    description: 'Absurd sci-fi scenarios, superpowers, and mind-bending thoughts.',
    icon: HelpCircle,
    accent: 'var(--color-player-b)',
    topics: [
      'Flying is a better superpower than invisibility.',
      'It would be better to live in space than under the ocean.',
      'We should explore deep space before exploring the deep ocean.',
      'It is better to be rich and famous than rich and completely unknown.'
    ]
  }
];

export default function TopicScreen() {
  const { state, dispatch } = useGame();
  const [selectedCategory, setSelectedCategory] = useState(null); // 'everyday', 'choices', 'hypotheticals', or null
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const allPresets = PRESETS.flatMap(c => c.topics);

  const handleSelectPreset = (topic) => {
    setSelectedTopic(topic);
    setCustomTopic('');
  };

  const handleCustomChange = (e) => {
    setCustomTopic(e.target.value);
    setSelectedTopic('');
  };

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * allPresets.length);
    const chosen = allPresets[randomIndex];
    
    const cat = PRESETS.find(p => p.topics.includes(chosen));
    if (cat) {
      setSelectedCategory(cat.id);
    }
    setSelectedTopic(chosen);
    setCustomTopic('');
  };

  const handleStart = async (e) => {
    if (e) e.preventDefault();
    const finalTopic = selectedTopic || customTopic.trim();
    if (!finalTopic || isGenerating) return;

    if (customTopic.trim()) {
      setIsGenerating(true);
      try {
        const nicheTopic = await generateNicheTopic(customTopic.trim());
        dispatch({ type: 'SET_TOPIC', payload: nicheTopic });
      } catch (err) {
        console.error('Niche topic generation error:', err);
        dispatch({ type: 'SET_TOPIC', payload: finalTopic });
      } finally {
        setIsGenerating(false);
      }
    } else {
      dispatch({ type: 'SET_TOPIC', payload: finalTopic });
    }
  };

  const currentTopicText = selectedTopic || customTopic.trim();
  const activeCategoryObj = PRESETS.find(p => p.id === selectedCategory);

  return (
    <div className="topic-screen-container container animate-fade-in">
      <div className="topic-header-section">
        <h2 className="topic-title">Select Debate Topic</h2>
        <p className="topic-subtitle">
          {selectedCategory 
            ? `Choose a debate prompt under ${activeCategoryObj?.category}.` 
            : 'Select a category to browse topics, or enter a custom prompt.'}
        </p>
      </div>

      <div className="topic-workspace">
        {selectedCategory === null ? (
          /* Step 1: Category Selection Grid & Randomizer */
          <div className="category-choices-wrapper">
            <div className="category-choices-grid">
              {PRESETS.map((cat) => {
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="category-choice-card glass-panel animate-fade-in"
                    style={{ '--hover-color': cat.accent }}
                  >
                    <div className="category-icon-badge" style={{ backgroundColor: cat.accent + '12', color: cat.accent }}>
                      <IconComp size={22} />
                    </div>
                    <h3 className="category-choice-title">{cat.category}</h3>
                    <p className="category-choice-desc">{cat.description}</p>
                  </button>
                );
              })}
            </div>
            
            <div className="surprise-me-center animate-fade-in">
              <button 
                type="button" 
                onClick={handleRandomize} 
                className="btn btn-secondary btn-surprise-large"
              >
                <Sparkles size={16} className="text-indigo animate-pulse-slow" />
                <span>Surprise Me with a Random Topic</span>
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Topics List for Chosen Category & Integrated Selection Card */
          <div className="focused-topics-panel glass-panel animate-fade-in">
            <div className="panel-header">
              <button 
                type="button" 
                onClick={() => { setSelectedCategory(null); setSelectedTopic(''); }} 
                className="btn-back-categories"
              >
                <ArrowLeft size={14} />
                <span>Back to Categories</span>
              </button>
              <h3 className="panel-title-text" style={{ color: activeCategoryObj?.accent }}>
                {activeCategoryObj?.category}
              </h3>
            </div>

            <div className="focused-topics-list">
              {activeCategoryObj?.topics.map((topic) => {
                const isSelected = selectedTopic === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    className={`topic-row-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectPreset(topic)}
                  >
                    <div className="item-indicator-icon">
                      {isSelected ? <Check size={10} /> : <BookOpen size={10} />}
                    </div>
                    <span className="item-row-text">{topic}</span>
                  </button>
                );
              })}
            </div>

            {/* Integrated Selection Confirmation Box */}
            {selectedTopic && (
              <div className="topic-selected-inline-panel animate-fade-in">
                <div className="selected-panel-info">
                  <span className="selected-panel-tag">Debate Prompt Selected</span>
                  <p className="selected-panel-text">"{selectedTopic}"</p>
                </div>
                <button onClick={handleStart} className="btn btn-primary btn-panel-start">
                  <span>Enter Arena</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="section-divider">
        <span className="divider-line"></span>
        <span className="divider-label">OR CREATE CUSTOM</span>
        <span className="divider-line"></span>
      </div>

      {/* Custom Input Inline Bar */}
      <form onSubmit={handleStart} className="custom-topic-form">
        <div className={`inline-search-bar ${customTopic ? 'focused' : ''}`}>
          <Search size={18} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Type a custom debate topic..."
            className="search-bar-input"
            value={customTopic}
            onChange={handleCustomChange}
            disabled={isGenerating}
          />
          
          {customTopic.trim() && (
            <button
              type="submit"
              disabled={isGenerating}
              className="btn btn-primary btn-inline-submit"
            >
              {isGenerating ? (
                <span className="inline-spinner"></span>
              ) : (
                <>
                  <span>Start Debate</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </form>

      <style>{`
        .topic-screen-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
          width: 100%;
        }

        .topic-header-section {
          margin-bottom: 32px;
          text-align: center;
        }

        .topic-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .topic-subtitle {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .topic-workspace {
          width: 100%;
          max-width: 680px;
          min-height: 250px;
          display: flex;
          flex-direction: column;
        }

        /* Category choice cards grid wrapper */
        .category-choices-wrapper {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }

        .category-choices-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          width: 100%;
        }

        .category-choice-card {
          padding: 28px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          background: var(--bg-secondary);
          border-radius: 16px;
          cursor: pointer;
          border: 1px solid var(--glass-border);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-choice-card:hover {
          border-color: var(--hover-color);
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.05);
        }

        .category-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }

        .category-choice-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .category-choice-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.45;
          text-align: center;
        }

        /* Surprise Me button placement */
        .surprise-me-center {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .btn-surprise-large {
          padding: 12px 28px;
          font-size: 0.88rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        /* Step 2: Focused topics list panel */
        .focused-topics-panel {
          width: 100%;
          padding: 24px;
          border-radius: 18px;
          background: var(--bg-secondary);
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 12px;
          margin-bottom: 18px;
        }

        .btn-back-categories {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .btn-back-categories:hover {
          color: var(--text-primary);
          background: var(--bg-primary);
        }

        .panel-title-text {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
        }

        .focused-topics-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .topic-row-item {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 12px 14px;
          cursor: pointer;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          text-align: left;
          transition: all 0.2s ease;
          width: 100%;
        }

        .topic-row-item:hover {
          background: var(--bg-primary);
        }

        .topic-row-item.selected {
          background: rgba(79, 70, 229, 0.04);
          border-color: var(--accent-primary);
        }

        .item-indicator-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--bg-primary);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          flex-shrink: 0;
          margin-top: 1px;
          transition: all 0.2s;
        }

        .topic-row-item.selected .item-indicator-icon {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        .item-row-text {
          font-size: 0.88rem;
          font-weight: 550;
          color: var(--text-secondary);
          line-height: 1.45;
          transition: color 0.2s;
        }

        .topic-row-item.selected .item-row-text {
          color: var(--text-primary);
          font-weight: 600;
        }

        /* Integrated Selection Confirmation Box - SaaS Style */
        .topic-selected-inline-panel {
          margin-top: 20px;
          padding: 16px 20px;
          border-radius: 12px;
          border: 1px solid var(--accent-primary);
          background: rgba(79, 70, 229, 0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .selected-panel-info {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .selected-panel-tag {
          font-family: var(--font-display);
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--accent-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .selected-panel-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
        }

        .btn-panel-start {
          padding: 10px 20px;
          font-size: 0.85rem;
          border-radius: 10px;
          height: 42px;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.15);
        }

        /* Divider details */
        .section-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 28px 0;
          width: 100%;
          max-width: 600px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--glass-border);
        }

        .divider-label {
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        /* Custom Input Bar */
        .custom-topic-form {
          width: 100%;
          max-width: 600px;
        }

        .inline-search-bar {
          display: flex;
          align-items: center;
          width: 100%;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 6px 6px 6px 16px;
          transition: all 0.2s;
          box-shadow: 0 1px 2px 0 rgba(0,0,0,0.02);
        }

        .inline-search-bar.focused, .inline-search-bar:focus-within {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }

        .search-bar-icon {
          color: var(--text-muted);
          margin-right: 12px;
          flex-shrink: 0;
        }

        .search-bar-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.95rem;
          padding: 8px 0;
          min-width: 50px;
        }

        .search-bar-input::placeholder {
          color: var(--text-muted);
        }

        .btn-inline-submit {
          padding: 8px 16px;
          font-size: 0.82rem;
          height: 38px;
          border-radius: 8px;
          min-width: 120px;
        }

        .text-indigo {
          color: var(--accent-primary);
        }

        .inline-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s infinite linear;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .category-choices-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .inline-search-bar {
            flex-direction: column;
            padding: 10px;
            gap: 10px;
            border-radius: 14px;
          }
          .search-bar-input {
            width: 100%;
            text-align: center;
          }
          .btn-inline-submit {
            width: 100%;
          }
          .topic-selected-inline-panel {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }
          .selected-panel-info {
            text-align: center;
          }
          .btn-panel-start {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
